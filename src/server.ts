import * as express from 'express'
import {Application} from 'express-serve-static-core'
import * as bp from 'body-parser'
import {default as db} from './db/models'
import apirouters = require('./routers/api');

const app: Application = express();

app.use(bp.urlencoded({extended: true}));
app.use(bp.json());

app.use('/api', apirouters);
app.use('/docs', express.static(__dirname + "/../docs"))

export {
    db, app
}