const { Op } = require('sequelize');
const path = require('path');
const ApiError = require(path.resolve('errors', 'index'));
const uuid = require('uuid');
const {
  Instance,
  Subtype,
  User,
  Type,
  InstanceSubtype,
  Instance_description,
  Save,
} = require(path.resolve('models', 'models'));

class DataController {
  async getInstances(req, res, next) {
    res.json(req.body);
  }

  async createInstance(req, res, next) {
    try {
      if (!req.body.userInfo.authorized) return next(ApiError.nonAuth());
      const { userInfo, instance } = req.body;

      const userID = userInfo.id;
      const possibleUsersID = [userID];
      if (!userInfo.isAdmin) {
        possibleUsersID.push(
          (
            await User.findOne({
              where: {
                login: 'admin',
              },
            })
          ).dataValues.id
        );
      }
      const [type, created] = await Type.findOrCreate({
        where: {
          type_name: instance.type.type_name,
          userId: possibleUsersID,
        },
        defaults: {
          userId: userID,
          type_color: instance.type.color,
        },
      });

      const typeID = type.dataValues.id;

      if (
        await Instance.findOne({
          where: {
            name: instance.name,
            userId: userID,
          },
        })
      ) {
        return next(ApiError.dbError('Такая колонка уже существует!'));
      }

      let instance_table = await Instance.create({
        name: instance.name,
        fromYear: instance.fromYear,
        toYear: instance.toYear,
        img: 'no image',
        userId: userID,
        typeId: typeID,
      });

      await Instance_description.create({
        instanceId: instance_table.id,
        description_text: instance.info.description,
        link_raw: (function (links) {
          return links.join(' ');
        })(instance.info.links),
      });

      for (let subtypeObj of instance.subtypes) {
        const [subtype, created] = await Subtype.findOrCreate({
          where: {
            subtype_name: subtypeObj.subtype_name,
            userId: possibleUsersID,
            typeId: typeID,
          },
          defaults: {
            userId: userID,
            subtype_color: subtypeObj.color,
          },
        });

        const subtypeID = subtype.dataValues.id;

        await InstanceSubtype.create({
          subtypeId: subtypeID,
          instanceId: instance_table.id,
        });
      }

      res.json(instance_table);
    } catch (err) {
      console.log(err);
      return next(ApiError.internal(err.message));
    }
  }

  async updateInstance(req, res, next) {}

  async deleteInstance(req, res, next) {}

  async getFilteredInstances(req, res, next) {
    try {
      const { filter, userInfo } = req.body;
      const {
        fromYear: reqFromYear,
        toYear: reqToYear,
        subtypes: reqSubtypes,
      } = filter;

      const userID = userInfo.id;
      let adminID = userID;
      const possibleUsersID = [userID];
      if (!userInfo.isAdmin) {
        possibleUsersID.push(
          (
            await User.findOne({
              where: {
                login: 'admin',
              },
            })
          ).dataValues.id
        );
        adminID = possibleUsersID[1];
      }

      const findedSubtypesId = (
        await Subtype.findAll({
          attributes: ['id'],
          where: {
            subtype_name: reqSubtypes,
            userId: possibleUsersID,
          },
        })
      ).map((obj) => obj.id);

      if (!findedSubtypesId.length)
        return next(ApiError.dbError('Не найдено колонок с такими подтипами'));

      let findedInstanceId = (
        await InstanceSubtype.findAll({
          where: {
            subtypeId: findedSubtypesId,
          },
        })
      ).map((obj) => obj.instanceId);

      if (!findedInstanceId.length)
        return next(ApiError.dbError('Не найдено колонок с такими подтипами'));

      let findedInstances = await Promise.all(
        (
          await Instance.findAll({
            where: {
              [Op.and]: [
                {
                  id: findedInstanceId,
                },
                {
                  [Op.or]: [
                    {
                      fromYear: {
                        [Op.between]: [reqFromYear, reqToYear],
                      },
                    },
                    {
                      toYear: {
                        [Op.between]: [reqFromYear, reqToYear],
                      },
                    },
                    {
                      [Op.and]: [
                        {
                          fromYear: {
                            [Op.lte]: reqFromYear,
                          },
                        },
                        {
                          toYear: {
                            [Op.gte]: reqToYear,
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  userId: possibleUsersID,
                },
              ],
            },
          })
        ).map(async (obj) => {
          return {
            id: obj.id,
            name: obj.name,
            fromYear: obj.fromYear,
            toYear: obj.toYear,

            type: (
              await Type.findOne({
                where: {
                  id: obj.typeId,
                },
              })
            ).type_name,

            subtype: (
              await Subtype.findAll({
                attributes: ['subtype_name'],
                where: {
                  id: (
                    await InstanceSubtype.findAll({
                      attributes: ['subtypeId'],
                      where: {
                        instanceId: obj.id,
                      },
                    })
                  ).map((obj) => obj.subtypeId),
                },
              })
            ).map((obj) => obj.subtype_name),
            user: obj.userId === adminID ? 'admin' : userInfo.login,
          };
        })
      );

      res.status(200).json(findedInstances);
    } catch (err) {
      return next(ApiError.internal(err.message));
    }
  }

  async changeImg(req, res, next) {
    if (!req.body.userInfo.authorized) return next(ApiError.nonAuth());
    const { id: instanceID } = req.body;
    const { id: userID } = req.body.userInfo;
    const { img } = req.files;
    let fileName = uuid.v4() + '.jpg';
    img.mv(path.resolve('public', 'gallery', fileName));
    await Instance.update(
      { img: fileName },
      {
        where: {
          id: instanceID,
          userId: userID,
        },
      }
    );
    res.status(200).json('Успешно изменено!');
  }

  async saveFilter(req, res, next) {
    if (!req.body.userInfo.authorized) return next(ApiError.nonAuth());
    const { filter, userInfo } = req.body;
    const { fromYear, toYear, types, subtypes } = filter;
    const userID = userInfo.id;

    if (!fromYear || !toYear)
      return next(ApiError.badRequest('Отсутствует fromYear или toYear!'));

    const possibleUsersID = [userID];
    if (!userInfo.isAdmin) {
      const admin = await User.findOne({
        where: {
          login: 'admin',
        },
      });
      if (admin) {
        possibleUsersID.push(admin.dataValues.id);
      }
    }

    const TypesRaw = (
      await Type.findAll({
        atributes: ['type_name'],
        where: {
          type_name: types,
          userId: possibleUsersID,
        },
      })
    )
      .map((obj) => obj.type_name)
      .join('$#$');

    const SubtypesRaw = (
      await Subtype.findAll({
        atributes: ['subtype_name'],
        where: {
          subtype_name: subtypes,
          userId: possibleUsersID,
        },
      })
    )
      .map((obj) => obj.subtype_name)
      .join('$#$');

    const [save, created] = await Save.findOrCreate({
      where: {
        userId: userID,
      },
      defaults: {
        fromYear: fromYear,
        toYear: toYear,
        type_raw: TypesRaw,
        subtype_raw: SubtypesRaw,
      },
    });

    if (!created) {
      save.update({
        fromYear: fromYear,
        toYear: toYear,
        type_raw: TypesRaw,
        subtype_raw: SubtypesRaw,
      });
    }

    res.json({
      save: save,
      created: created,
    });
  }

  async getTypesAndSubtypes(req, res, next) {
    if (!req.body.userInfo.authorized) return next(ApiError.nonAuth());
  }
}

module.exports = new DataController();
