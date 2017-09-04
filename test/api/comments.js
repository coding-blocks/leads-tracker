/**
 * Created by apoorvaa_gupta on 23/7/17.
 */

const mocha = require("mocha")
  , chai = require("chai")
  , chaiHttp = require("chai-http")
  , expect = chai.expect
  , should = chai.should();

chai.use(chaiHttp);
const api = chai.request("http://localhost:8000/api");
var testUserId = 2, testLeadId = 2;

it("POST /add should add a Comment", (done) => {
  api.post("/users/add").send({
    name: "Arnav Gupta",
    email: "arnavgupta@codingblocks.com",
    contact: "9874563210",
    centre: "Pitampura",
    designation: "Instructor"
  }).end((e, r1) => {
    testUserId = r1.body.data.id;
    api.post("/leads/add").send({
      name: "Apoorvaa Gupta"
      , email: "apoorvaagupta01@gmail.com"
      , contact: "9654194764"
    }).end((e, r2) => {
      testLeadId = r2.body.data.id;
      api.post("/comments/add").send({
        userId: testUserId
        , leadId: testLeadId
        , comment: "Hello"
      }).end((e, r) => {
        r.statusCode.should.equal(201);
        r.body.success.should.equal(true);
        r.body.data.comment.should.equal("Hello");
        done();
      });
    });
  });
});


it("POST /add should fetch error", (done) => {
  api.post("/comments/add").send({}).end((e, r) => {
    r.statusCode.should.equal(400);
    r.body.success.should.equal(false);
    r.body.error.message.should.equal("Could not add the Comment(Incorrect Details).");
    done();
  });
});


it(`GET /${testLeadId} should fetch comments for the Lead`, (done) => {
  api.get("/comments/" + testLeadId).end((e, r) => {
    r.statusCode.should.equal(200);
    r.body.success.should.equal(true);
    r.body.data[0].comment.should.equal("Hello");
    done();
  });
});

it("DELETE /2 should delete user with id 2", (done) => {
  api.delete("/comments/2").end((e, r) => {
    r.statusCode.should.equal(200);
    r.body.success.should.equal(true);
    done();
  });
});

it("DELETE /2 should fetch error", (done) => {
  api.delete("/comments/2").end((e, r) => {
    r.statusCode.should.equal(404);
    r.body.success.should.equal(false);
    r.body.error.message.should.be.a("string");
    done();
  });
});

it("GET /2 should fetch error", (done) => {
  api.get("/comments/2").end((e, r) => {
    r.statusCode.should.equal(404);
    r.body.success.should.equal(false);
    r.body.error.message.should.be.a("string");
    done();
  });
});
