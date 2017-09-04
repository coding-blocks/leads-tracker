/**
 * Created by championswimmer on 13/07/17.
 */
const mocha = require('mocha')
//process.env.DATABASE_URL = "test db here"

const server = require('../dist/server')
  , app = server.app
  , db = server.db

function importTest(name, path) {
  describe(name, function () {
    require(path);
  });
}

before(function (done) {
  db.sync({force: true}).then(() => {
    app.listen(8000, () => done())
  })
})

describe("/api", function () {
  before(function () {
    console.info("Running API test");
  });
  importTest("/", './api/index.js');
  importTest("/courses", './api/courses.js');
  importTest("/users", './api/users.js');
  importTest("/leads", './api/leads.js');
  importTest("/centres", "./api/centres.js");
  importTest("/comments", "./api/comments.js");
  after(function () {
    console.info("All API tests have run");
  });
});

describe("Database", function () {
  beforeEach(function () {
    console.log("Running API test");
  });
  //importTest("/", './api/index.js');
  after(function () {
    console.log("All API tests have run");
  });
});



