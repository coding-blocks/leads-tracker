import * as express from 'express'
import {Application} from 'express-serve-static-core'
import * as bp from 'body-parser'

const app : Application = express();

app.listen(4000,function (req,res) {
   console.log('Server Listening at 4000');
});