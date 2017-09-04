const router = require('express').Router();
const models = require('../../db/models').models;

/**
 * @api {get} /comments/:leadId GET /comments/:leadId
 * @apiName GetCommentsForALeadById
 * @apiGroup Comments
 *
 * @apiParam {number} leadId id of the Lead
 *
 * @apiSuccessExample {json} SuccessResponse
 *    HTTP/1.1 200 OK
 *    {
 *      "success": true,
 *      "data": [
 *        {
 *          "id": 3,
 *          "comment": "Hello",
 *          "createdAt": "2017-08-27T16:57:48.791Z",
 *          "updatedAt": "2017-08-27T16:57:48.791Z",
 *          "leadId": 2,
 *          "userId": 2,
 *          "user": {
 *            "id": 2,
 *            "name": "Arnav Gupta",
 *            "email": "arnavgupta@codingblocks.com",
 *            "contact": "9874563210",
 *            "designation": "Instructor",
 *            "centre": "Pitampura",
 *            "createdAt": "2017-08-26T18:05:49.221Z",
 *            "updatedAt": "2017-08-26T18:05:49.221Z"
 *           },
 *          "lead": {
 *            "id": 2,
 *            "name": "Apoorvaa Gupta",
 *            "email": "apoorvaagupta01@gmail.com",
 *            "contact": "9898989898",
 *            "dob": null,
 *            "gaurdianName": null,
 *            "gaurdianContact": null,
 *            "gaurdianEmail": null,
 *            "college": null,
 *            "branch": null,
 *            "university": null,
 *            "collegeBatch": null,
 *            "address": null,
 *            "city": null,
 *            "state": null,
 *            "pincode": null,
 *            "coursesOfInterest": null,
 *            "centresOfInterest": null,
 *            "referrer": null,
 *            "VMCRollNumber": null,
 *            "CBRollNumber": null,
 *            "cbStudentReferral": null,
 *            "status": "new",
 *            "createdAt": "2017-08-26T18:05:49.231Z",
 *            "updatedAt": "2017-08-26T18:05:49.231Z"
 *          }
 *        }
 *      ]
 *    }
 *
 * @apiErrorExample {json} ErrorResponse(Comments not found)
 *      HTTP/1.1 404 Not Found
 *      {
 *        success: false
          , code: "404"
          , error: {
            message: `There are no comments for the lead with id 1.`
          }
 *      }
 *
 * @apiErrorExample {json} ErrorResponse(Server Error)
 *      HTTP/1.1 500 Internal Server Error
 *      {
 *        success: false
 *        , code: "500"
 *        , error: {
 *          message: "Could not get all the comments for the lead with id 0(Internal Server Error)."
 *        }
 *      }
 *
 */

// get all the comments of a lead
router.get('/:leadId', function (req, res) {
  const leadId = +req.params.leadId;
  models.Comment.findAll({
    where: {leadId: leadId}
    , include: [models.User, models.Lead]
  }).then(function (comments) {
    if (comments.length !== 0) {
      res.status(200).send({success: true, data: comments.map((comment) => comment.get())})
    } else {
      res.status(404).send({
        success: false
        , code: "404"
        , error: {
          message: `There are no comments for the lead with id ${leadId}.`
        }
      })
    }
  }).catch(function (err) {
    console.log(err);
    res.status(500).send({
      success: false
      , code: "500"
      , error: {
        message: `Could not get all the comments for the lead with id ${leadId}(Internal Server Error).`
      }
    })
  })
});


/*{
  "success": true,
  "data": {
  "id": 3,
    "comment": "Hello",
    "userId": 2,
    "leadId": 2,
    "updatedAt": "2017-08-27T16:57:48.791Z",
    "createdAt": "2017-08-27T16:57:48.791Z"
}
}*/


/**
 *
 * @api {post} /comments/add POST /comments/add
 * @apiName AddComment
 * @apiGroup Comments
 *
 * @apiParam {number} leadId Id of the Lead
 * @apiParam {number} userId Id of the User
 *
 * @apiSuccessExample {json} SuccessResponse
 *    HTTP/1.1 201 Created
 *    {
 *      "success": true,
 *      "data": {
 *        "id": 5,
 *        "name": "Gurugram",
 *        "updatedAt": "2017-08-27T04:27:26.426Z",
 *        "createdAt": "2017-08-27T04:27:26.426Z"
 *      }
 *    }
 *
 * @apiErrorExample {json} ErrorResponse(Incorrect Details)
 *      HTTP/1.1 400 Bad Request
 *      {
 *        success: false
 *        , code: "400"
 *        , error: {
 *          message: "Could not add the centre(Incorrect Details)."
 *        }
 *      }
 *
 * @apiErrorExample {json} ErrorResponse(Centre already Exists)
 *      HTTP/1.1 400 Bad Request
 *      {
 *        success: false
 *        , code: "400"
 *        , error: {
 *          message: "Could not add the centre(Centre already Exists)."
 *        }
 *      }
 *
 * @apiErrorExample {json} ErrorResponse(Server Error)
 *      HTTP/1.1 500 Internal Server Error
 *      {
 *        success: false
 *        , code: "500"
 *        , error: {
 *          message: "Could not add the centre(Internal Server Error)."
 *        }
 *      }
 */


//add a comment -- lead id will be there in the body
router.post('/add', function (req, res) {
  const userId = req.body.userId;
  const leadId = req.body.leadId;

  if (!userId || !leadId || req.body.comment === '') {
    return res.status(400).send({
      success: false
      , code: "400"
      , error: {
        message: "Could not add the Comment(Incorrect Details)."
      }
    })
  }

  models.Comment.create({
    comment: req.body.comment
    , userId: userId
    , leadId: leadId
  }).then(function (comment) {
    if (comment) {
      res.status(201).send({
        success: true
        , data: comment.get()
      })
    } else {
      res.status(400).send({
        success: false
        , code: "400"
        , error: {
          message: "Could not add the Comment(Incorrect Details)."
        }
      })
    }
  }).catch(function (err) {
    console.log(err);
    res.status(500).send({
      success: false
      , code: "500"
      , error: {
        message: "Could not add the Comment(Internal Server Error)."
      }
    })
  })
});

// delete all comments of a lead
router.delete('/:leadId', function (req, res) {
  const leadId = +req.params.leadId;
  models.Comment.destroy({
    where: {leadId: leadId}
  }).then(function (noOfCommentsDeleted) {
    console.log(noOfCommentsDeleted)
    if (noOfCommentsDeleted !== 0) {
      res.status(200).send({success: true})
    } else {
      res.status(404).send({
        success: false
        , code: "404"
        , error: {
          message: `Could not delete the Comments for the lead with id ${leadId} (Comments not found).`
        }
      })
    }
  }).catch(function (err) {
    console.log(err);
    res.status(500).send({
      success: false
      , code: "500"
      , error: {
        message: `Could not delete the Comments for the lead with id ${leadId} (Internal Server Error).`
      }
    })
  })

});

module.exports = router;