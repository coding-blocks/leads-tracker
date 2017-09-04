/**
 * Created by championswimmer on 13/07/17.
 */
import {app, db} from './server'
const CONFIG = require('../config.js')

db.sync({force: false}).then(() => {
  console.log('Database configured')

  app.listen(CONFIG.PORT, function (req, res, next) {
    console.log('Server Listening at 8080');
  });
});