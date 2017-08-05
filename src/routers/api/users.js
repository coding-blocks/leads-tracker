const router = require('express').Router();
const models = require('../../db/models').models;

/**
 * @api {get} /users/ GET /users/
 * @apiName GetUsers
 * @apiGroup User
 *
 */
router.get('/', function (req, res) {
  models.User.findAll().then(function (users) {
    if (users.length !== 0) {
      return res.status(200).send({success: true, data: users.map((user) => user.get())})
    } else {
      res.status(404).send({
        success: false
        , code: "404"
        , error: {
          message: "There are no Users."
        }
      })
    }
  }).catch(function (err) {
    console.log(err);
    res.status(500).send({
      success: false
      , code: "500"
      , error: {
        message: "Could not get all the Users(Internal Server Error)."
      }
    })
  })
});

/**
 * @api {get} /users/:id GET /users/:id
 * @apiName GetUserById
 * @apiGroup User
 *
 * @apiParam {number} id
 *
 */
router.get('/:id', function (req, res) {
  models.User.findOne({
    where: {id: parseInt(req.params.id)}
  }).then(function (user) {
    if (user) {
      return res.status(200).send({success: true, data: user.get()});
    } else {
      res.status(404).send({
        success: false
        , code: "404"
        , error: {
          message: `No User found for the id ${(+req.params.id)}.`
        }
      })
    }
  }).catch(function (err) {
    console.log(err);
    res.status(500).send({
      success: false
      , code: "500"
      , error: {
        message: `Could not get the User with id ${(+req.params.id)} (Internal Server Error).`
      }
    })
  })
});


/**
 * @api {post} /users/add POST /users/add
 * @apiName AddUser
 * @apiGroup User
 *
 * @apiParam {string} name
 * @apiParam {string} email
 * @apiParam {string} contact Phone number
 * @apiParam {string} centre
 *
 */
router.post('/add', function (req, res) {
  const userData = req.body.userData || {
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      centre: req.body.centre,
      designation: req.body.designation
    };

  models.User.create(userData).then(function (user) {
    if (user) {
      return res.status(201).send({success: true, data: user.get()})
    } else {
      res.status(400).send({
        success: false
        , code: "400"
        , error: {
          message: "Could not add the User(Incorrect Details)."
        }
      })
    }
  }).catch(function (err) {
    console.log(err);
    res.status(500).send({
      success: false
      , code: "500"
      , error: {
        message: "Could not add the User(Internal Server Error)."
      }
    })
  })
});

/**
 * @api {put} /users/:id PUT /users/:id
 * @apiName EditUser
 * @apiGroup User
 *
 * @apiParam {string} name
 * @apiParam {string} email
 * @apiParam {string} contact Phone number
 * @apiParam {string} centre
 *
 */
router.put('/:id', function (req, res) {
  const userData = req.body.userData || {
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      centre: req.body.centre,
      designation: req.body.designation
    };

  models.User.update(userData, {
    where: {id: parseInt(req.params.id)},
    returning: true
  }).then(function (rows) {
    const user = rows[1][0];
    if (rows[0] !== 0 && user) {
      res.status(200).send({success: true, data: user.get()});
    } else {
      res.status(404).send({
        success: false
        , code: "404"
        , error: {
          message: `Could not update the user with id ${(+req.params.id)} (User not found).`
        }
      })
    }
  }).catch(function (error) {
    console.error(error);
    res.status(500).send({
      success: false
      , code: "500"
      , error: {
        message: `Could not update the user with id ${(+req.params.id)} (Internal Server Error).`
      }
    })
  });
});

/**
 * @api {delete} /users/:id DELETE /users/:id
 * @apiName DeleteUser
 * @apiGroup User
 *
 */
router.delete('/:id', function (req, res) {
  models.User.destroy({
    where: {id: parseInt(req.params.id)},
    returning: true
  }).then(function (noOfUsersDeleted) {
    if (noOfUsersDeleted !== 0) {
      res.status(200).send({success: true})
    } else {
      res.status(404).send({
        success: false
        , code: "404"
        , error: {
          message: `Could not delete the user with id ${(+req.params.id)} (User not found).`
        }
      })
    }
  }).catch(function (error) {
    console.error(error);
    res.status(500).send({
      success: false
      , code: "500"
      , error: {
        message: `Could not delete the lead with id ${(+req.params.id)} (Internal Server Error).`
      }
    })
  });

});

module.exports = router;