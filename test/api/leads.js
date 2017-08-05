/**
 * Created by bhavya on 16/7/17.
 */

const mocha = require('mocha')
  , chai = require('chai')
  , chaiHttp = require('chai-http')
  , expect = chai.expect
  , should = chai.should();

chai.use(chaiHttp)
const api = chai.request("http://localhost:8000/api/leads")

it("POST /add should add a lead(Correct Details)", (done) => {
  api.post('/add').send({
    name: 'Bhavya Aggarwal'
    , email: 'bhavya.spv@gmail.com'
    , contact: '9899175630'
  }).end((e, r) => {
    r.statusCode.should.equal(201)
    r.body.success.should.equal(true)
    r.body.data.status.should.equal('New');
    done()
  })
})

it("POST /add should add a lead(Incorrect Details)", (done) => {
  api.post('/add').send({
    name: 'Bhavya Aggarwal'
  }).end((e, r) => {
    r.statusCode.should.equal(400)
    r.body.success.should.equal(false)
    r.body.error.message.should.equal("Could not add the lead(Incorrect Details).")
    done()
  })
})

it("GET all should fetch all Leads", (done) => {
  api.get('/').end((e, r) => {
    r.statusCode.should.equal(200)
    r.body.success.should.equal(true)
    r.body.data.should.be.an('array')
    r.body.data[0].name.should.equal('Bhavya Aggarwal')
    r.body.data[0].email.should.equal('bhavya.spv@gmail.com')
    r.body.data[0].contact.should.equal('9899175630')
    done()
  })
})


it("GET /1 should fetch First Lead", (done) => {
  api.get('/1').end((e, r) => {
    r.statusCode.should.equal(200)
    r.body.success.should.equal(true)
    r.body.data.name.should.equal('Bhavya Aggarwal')
    r.body.data.email.should.equal('bhavya.spv@gmail.com')
    r.body.data.contact.should.equal('9899175630')
    done()
  })
})

it("GET /2 should fetch error", (done) => {
  api.get('/2').end((e, r) => {
    r.statusCode.should.equal(404)
    r.body.success.should.equal(false)
    r.body.error.message.should.be.a('string')
    done()
  })
})

it("PUT /1 should update First Lead", (done) => {
  api.put('/1').send({
    dob: '12/09/1997'
  }).end((e, r) => {
    r.statusCode.should.equal(200)
    r.body.success.should.equal(true)
    r.body.data.name.should.equal('Bhavya Aggarwal')
    r.body.data.email.should.equal('bhavya.spv@gmail.com')
    r.body.data.contact.should.equal('9899175630')
    r.body.data.dob.should.equal('12/09/1997')
    done()
  })
})

it("PUT /2 should fetch error", (done) => {
  api.put('/2').send({
    dob: '12/09/1997'
  }).end((e, r) => {
    r.statusCode.should.equal(404)
    r.body.success.should.equal(false)
    r.body.error.message.should.be.a('string')
    r.body.error.message.should.equal('Could not update the lead with id 2 (Lead not found).')
    done()
  })
})

it("DELETE /1 should delete First Lead", (done) => {
  api.delete('/1').end((e, r) => {
    r.statusCode.should.equal(200)
    r.body.success.should.equal(true)
    done()
  })
})

it("DELETE /2 should fetch error", (done) => {
  api.delete('/2').end((e, r) => {
    r.statusCode.should.equal(404)
    r.body.success.should.equal(false)
    r.body.error.message.should.be.a('string')
    r.body.error.message.should.equal('Could not delete the lead with id 2 (Lead not found).')
    done()
  })
})

it("GET all should fetch error", (done) => {
  api.get('/').end((e, r) => {
    r.statusCode.should.equal(404)
    r.body.success.should.equal(false)
    r.body.error.message.should.equal("There are no leads.")
    done()
  })
})