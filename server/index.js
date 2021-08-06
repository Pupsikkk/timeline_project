require('dotenv').config();
const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const apiRouter = require(path.join(__dirname, 'routes', 'index'));
const sequelize = require(path.join(__dirname, 'db'));
const errorsHandler = require(path.resolve('middleware', 'errorsHandler'));

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(fileUpload({}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRouter);
app.use(errorsHandler);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log('Server started on port ' + PORT);
    });
  } catch (err) {
    console.log(err);
  }
}

start();
