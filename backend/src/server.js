require('dotenv').config();
const config = require('./config');
const app = require('./app');

/* app.listen(3333); */
app.listen(config.app.port, (err) => {
    if (err) {
      return console.log('erro');
    }
    console.log(`iniciou em http://localhost:${config.app.port}`);

  });