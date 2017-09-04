/**
 * Created by bhavyaagg on 05/08/17.
 */

const router = require('express').Router();
const models = require('../../db/models').models;
const axios = require('axios');
const uid = require('uid2');

var secrets;
try {
  secrets = require('./../../../secrets.json');
} catch (e) {
  console.error('Create your own secrets file lazybones');
  secrets = require('./../../../secret-sample.json');
}

/**
 *
 * @api {post} /auth/ POST /auth/
 * @apiName PostAuth
 * @apiGroup Auth
 *
 * @apiParam {string} code The request code we get from 1st part of explicit Oauth2
 *
 * @apiErrorExample {json} ErrorResponse(OneAuth Server Error: POST)
 *      HTTP/1.1 500 Internal Server Error
 *      {
 *        "success": false,
 *        "code": "500",
 *        "error": {
 *            "message": "Could not post data to OneAuth API(OneAuth Server POST Error)."
 *        }
 *      }
 *
 * @apiErrorExample {json} ErrorResponse(Database Error: FIND)
 *      HTTP/1.1 500 Internal Server Error
 *      {
 *        "success": false,
 *        "code": "500",
 *        "error": {
 *            "message": "Could not find in OneAuth Table(Database Error: FIND)."
 *        }
 *      }
 *
 * @apiErrorExample {json} ErrorResponse(OneAuth Server Error: GET)
 *      HTTP/1.1 500 Internal Server Error
 *      {
 *        "success": false,
 *        "code": "500",
 *        "error": {
 *            "message": "Could not get details from OneAuth API(OneAuth Server Error: GET)."
 *        }
 *      }
 *
 * @apiErrorExample {json} ErrorResponse(Database Error: CREATE)
 *      HTTP/1.1 500 Internal Server Error
 *      {
 *        "success": false,
 *        "code": "500",
 *        "error": {
 *            "message": "Could not create in OneAuth Table(Database Error: CREATE)."
 *        }
 *      }
 *
 *
 * @apiErrorExample {json} ErrorResponse(Unauthorized)
 *      HTTP/1.1 401 Unauthorized
 *      {
 *        "success": false,
 *        "code": "500",
 *        "error": {
 *            "message": "Accessible to only CB employees(Unauthorized)"
 *        }
 *      }
 *
 * @apiSuccessExample {json} SuccessResponse(User Exists)
 *      HTTP/1.1 200 OK
 *      {
 *        "success": true,
 *        "code": "200",
 *        "token": "Random Token"
 *
 *      }
 *
 * @apiSuccessExample {json} SuccessResponse(New User)
 *      HTTP/1.1 201 Created
 *      {
 *        "success": true,
 *        "code": "201",
 *        "token": "Random Token"
 *      }
 */
router.post('/', function (req, res) {
  axios.post('https://account.codingblocks.com/oauth/token',
    {
      "client_id": secrets.CLIENT_ID,
      "redirect_uri": secrets.REDIRECT_URI,
      "client_secret": secrets.CLIENT_SECRET,
      "grant_type": secrets.GRANT_TYPE,
      "code": req.body.code
    })
    .then(function (authtoken) {
      models.Oneauth.findOne({
        where: {
          oneauthToken: authtoken.data.access_token
        }
      }).then(function (oneauth) {
        if (oneauth !== null) {
          res.status(200).send({
            success: true,
            token: oneauth.token
          })
        }
        else {
          axios.get('https://account.codingblocks.com/api/users/me', {
            headers: {'Authorization': `Bearer ${authtoken.data.access_token}`}
          }).then(function (user) {
            if (user.data.role === 'admin' || user.data.role === 'employee') {
              models.Oneauth.create({
                user: {
                  name: user.data.firstname + " " + user.data.lastname,
                  email: user.data.email,
                  role: user.data.role
                }
                , oneauthToken: authtoken.data.access_token
                , token: uid(30)
              }, {
                include: [models.User]
              }).then(function (oneauthFinal) {
                res.status(201).send({
                  success: true,
                  token: oneauthFinal.token
                })
              }).catch(function (err) {
                console.log(err);
                res.status(500).send({
                  success: false
                  , code: "500"
                  , error: {
                    message: "Could not create in OneAuth Table(Database Error)."
                  }
                })
              })
            } else {
              return res.status(401).send({
                success: false
                , code: "401"
                , error: {
                  message: "Accessible to only CB employees(Unauthorized)"
                }

              })
            }

          }).catch(function (err) {
            console.log(err);
            res.status(500).send({
              success: false
              , code: "500"
              , error: {
                message: "Could not get details from OneAuth API(OneAuth Server GET Error)."
              }
            })
          })
        }
      }).catch(function (err) {
        console.log(err);
        res.status(500).send({
          success: false
          , code: "500"
          , error: {
            message: "Could not find in OneAuth Table(Database Error)."
          }
        })
      })
    }).catch(function (err) {
    console.log(err);
    res.status(500).send({
      success: false
      , code: "500"
      , error: {
        message: "Could not post data to OneAuth API(OneAuth Server POST Error)."
      }
    })
  })
});

module.exports = router;