const router = require('express').Router();
const models = require('../../db/models').models;

// get all the centers

/**
 *
 * @api {get} /centres/ GET /centres/
 * @apiName GetCentres
 * @apiGroup Centres
 *
 * @apiErrorExample {json} ErrorResponse(No Centres)
 *      HTTP/1.1 404 Not Found
 *      {
 *        success: false
 *        , code: "404"
 *        , error: {
 *          message: "There are no centres."
 *        }
 *      }
 *
 * @apiErrorExample {json} ErrorResponse(Server Error)
 *      HTTP/1.1 500 Internal Server Error
 *      {
 *        success: false
 *        , code: "500"
 *        , error: {
 *          message: "Could not get all the centres(Internal Server Error)."
 *        }
 *      }
 *
 * @apiSuccessExample {json} SuccessResponse
 *      HTTP/1.1 200 OK
 *      {
 *        success: true
 *        , "data": [
            {
              "id": 2,
              "name": "Pitampura",
              "createdAt": "2017-08-27T04:18:10.385Z",
              "updatedAt": "2017-08-27T04:18:10.385Z"
            },
            {
              "id": 3,
              "name": "Dwarka",
              "createdAt": "2017-08-27T04:18:28.449Z",
              "updatedAt": "2017-08-27T04:18:28.449Z"
            }
          ]
 *      }
 *
 */

router.get('/', function (req, res) {
  models.Centre.findAll().then(function (centres) {
    if (centres.length !== 0) {
      res.status(200).send({success: true, data: centres.map((centre) => centre.get())});
    } else {
      res.status(404).send({
        success: false
        , code: "404"
        , error: {
          message: "There are no centres."
        }
      })
    }
  }).catch(function (err) {
    console.log(err);
    res.status(500).send({
      success: false
      , code: "500"
      , error: {
        message: "Could not get all the centres(Internal Server Error)."
      }
    })
  })
});

/**
 *
 * @api {post} /centres/add POST /centres/add
 * @apiName AddCentre
 * @apiGroup Centres
 *
 * @apiParam {string} name Name of the Centre
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

//add any center
router.post('/add', function (req, res) {
  const centreData = req.body.centreData || {
    name: req.body.name
  };

  models.Centre.create(centreData).then(function (centre) {
    if (centre) {
      res.status(201).send({success: true, data: centre.get()});
    } else {
      res.status(400).send({
        success: false
        , code: "400"
        , error: {
          message: "Could not add the centre(Incorrect Details)."
        }
      })
    }
  }).catch(function (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).send({
        success: false
        , code: "400"
        , error: {
          message: "Could not add the centre(Centre already Exists)."
        }
      })
    } else {
      console.log(err);
      res.status(500).send({
        success: false
        , code: "500"
        , error: {
          message: "Could not add the centre(Internal Server Error)."
        }
      })
    }
  })
});

/**
 * @api {get} /centres/:id GET /centres/:id
 * @apiName GetCentreById
 * @apiGroup Centres
 *
 * @apiParam {number} id id of the Centre
 *
 * @apiSuccessExample {json} SuccessResponse
 *    HTTP/1.1 200 OK
 *    {
 *      "success": true,
 *      "data": {
 *        "id": 2,
 *        "name": "Pitampura",
 *        "updatedAt": "2017-08-27T04:27:26.426Z",
 *        "createdAt": "2017-08-27T04:27:26.426Z"
 *      }
 *    }
 *
 * @apiErrorExample {json} ErrorResponse(Centre not found)
 *      HTTP/1.1 404 Not Found
 *      {
 *        success: false
 *        , code: "404"
 *        , error: {
 *          message: "No Centre found for the id 0."
 *        }
 *      }
 *
 * @apiErrorExample {json} ErrorResponse(Server Error)
 *      HTTP/1.1 500 Internal Server Error
 *      {
 *        success: false
 *        , code: "500"
 *        , error: {
 *          message: "Could not get the centre with id 2 (Internal Server Error)."
 *        }
 *      }
 *
 */

router.get('/:id', function (req, res) {
  const centreId = +req.params.id;
  models.Centre.findByPrimary(centreId).then(function (centre) {
    if (centre) {
      res.status(200).send({success: true, data: centre.get()});
    } else {
      res.status(404).send({
        success: false
        , code: "404"
        , error: {
          message: `No Centre found for the id ${centreId} (Centre not found).`
        }
      })
    }
  }).catch(function (err) {
    console.log(err);
    res.status(500).send({
      success: false
      , code: "500"
      , error: {
        message: `Could not get the centre with id ${centreId} (Internal Server Error).`
      }
    })
  })
});

/**
 * @api {delete} /centres/:id DELETE /centres/:id
 * @apiName DeleteCentre
 * @apiGroup Centres
 * @apiParam {number} id
 *
 * @apiSuccessExample {json} SuccessResponse
 *    HTTP/1.1 200 OK
 *    {
 *      "success": true
 *    }
 *
 * @apiErrorExample {json} ErrorResponse(Centre not found)
 *      HTTP/1.1 404 Not Found
 *      {
 *        success: false
 *        , code: "404"
 *        , error: {
 *          message: "Could not delete the centre with id 0 (Centre not found)."
 *        }
 *      }
 *
 * @apiErrorExample {json} ErrorResponse(Server Error)
 *      HTTP/1.1 500 Internal Server Error
 *      {
 *        success: false
 *        , code: "500"
 *        , error: {
 *          message: "Could not delete the centre with id 0 (Internal Server Error)."
 *        }
 *      }
 */

// delete any center
router.delete('/:id', function (req, res) {
  const centreId = +req.params.id;
  models.Centre.destroy({
    where: {id: centreId}
  }).then(function (noOfCentresDeleted) {
    if (noOfCentresDeleted !== 0) {
      res.status(200).send({success: true})
    } else {
      res.status(404).send({
        success: false
        , code: "404"
        , error: {
          message: `Could not delete the centre with id ${centreId} (Centre not found).`
        }
      })
    }
  }).catch(function (err) {
    console.log(err);
    res.status(500).send({
      success: false
      , code: "500"
      , error: {
        message: `Could not delete the centre with id ${centreId} (Internal Server Error).`
      }
    })
  })
});

module.exports = router;
