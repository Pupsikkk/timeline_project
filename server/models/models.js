const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'db'));
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  login: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});

const Type = sequelize.define(
  'type',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type_name: { type: DataTypes.STRING, asllowNull: false },
    type_color: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: false,
  }
);

const Save = sequelize.define(
  'save',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fromYear: { type: DataTypes.INTEGER, allowNull: false },
    toYear: { type: DataTypes.INTEGER, allowNull: false },
    type_raw: { type: DataTypes.TEXT, allowNull: true },
    subtype_raw: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    timestamps: false,
  }
);

const Subtype = sequelize.define(
  'subtype',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    subtype_name: { type: DataTypes.STRING, allowNull: false },
    subtype_color: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: false,
  }
);

const Instance = sequelize.define(
  'instance',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    fromYear: { type: DataTypes.INTEGER, allowNull: false },
    toYear: { type: DataTypes.INTEGER, allowNull: false },
    img: { type: DataTypes.STRING },
  },
  {
    timestamps: false,
  }
);

const Instance_description = sequelize.define(
  'instance_description',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description_text: { type: DataTypes.TEXT },
    link_raw: { type: DataTypes.TEXT },
  },
  {
    timestamps: false,
  }
);

const InstanceSubtype = sequelize.define(
  'instanceSubtype',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  {
    timestamps: false,
  }
);

User.hasMany(Instance, { onDelete: 'cascade' });
Instance.belongsTo(User);

User.hasMany(Type, { onDelete: 'cascade' });
Type.belongsTo(User);

User.hasMany(Subtype, { onDelete: 'cascade' });
Subtype.belongsTo(User);

User.hasOne(Save, { onDelete: 'cascade' });
Save.belongsTo(User);

Type.hasMany(Instance, { onDelete: 'cascade' });
Instance.belongsTo(Type);

Type.hasMany(Subtype, { onDelete: 'cascade' });
Subtype.belongsTo(Type);

Instance.hasOne(Instance_description, { onDelete: 'cascade' });
Instance_description.belongsTo(Instance);

Instance.belongsToMany(Subtype, { through: InstanceSubtype });
Subtype.belongsToMany(Instance, { through: InstanceSubtype });

module.exports = {
  User,
  Instance,
  Type,
  Subtype,
  Instance_description,
  Save,
  InstanceSubtype,
};
