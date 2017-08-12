
/* global it */
/* global describe */
/* global require */
/* jshint node: true */

'use strict'

var chai = require('chai')
var chaiHttp = require('chai-http')
var server = require('./test-server')
var should = chai.should() // eslint-disable-line

chai.use(chaiHttp)

var testAccountName = 'chai_latte_with_cinnamon'.replace(/\s/g, '-')
var secondTestAccountName = 'vanilla_latte_without_cinnamon'
var thirdTestAccountName = 'caramelatte' // eslint-disable-line
var fourthTestAccountName = 'americano' // eslint-disable-line

describe('/api/users', function () {
  it('should add a SINGLE user on /api/users POST', function (done) {
    chai.request(server)
      .post('/api/users')
      .send({'name': testAccountName, 'password': 'secret'})
      .end(function (err, res) { // eslint-disable-line
        res.should.have.status(200)
        res.should.be.json // eslint-disable-line
        res.body.should.be.a('object')
        res.body.should.have.property('name')
        res.body.should.have.property('_id')
        res.body.should.have.property('_rev')
        res.body.name.should.equal(testAccountName)
        res.body._id.should.equal('org.couchdb.user:' + testAccountName)
        done()
      })
  })

  it('should list selected users on /api/users GET', function (done) {
    chai.request(server)
      .get('/api/users?skip=0&limit=6&sortBy=id&sortDirection=asc')
      .end(function (err, res) { // eslint-disable-line
        res.should.have.status(200)
        res.should.be.json // eslint-disable-line
        res.body.should.be.a('object')
        res.body.should.have.property('total_rows')
        res.body.should.have.property('offset')
        res.body.should.have.property('rows')
        res.body.rows.should.be.a('array')
        done()
      })
  })

  it('should return an error message when trying to create a user that already exists on /api/users POST', function (done) {
    chai.request(server)
      .post('/api/users')
      .send({'name': testAccountName, 'password': 'secret'})
      .end(function (err, res) { // eslint-disable-line
        res.should.have.status(400)
        res.should.be.json // eslint-disable-line
        res.body.should.be.a('object')
        res.body.should.have.property('name')
        res.body.should.have.property('errors')
        res.body.name.should.equal('ValidationError')
        res.body.errors.name.should.equal('unique')
        done()
      })
  })

  it('should list a SINGLE user on /api/users/<name> GET', function (done) {
    chai.request(server)
      .get('/api/users/' + testAccountName)
      .end(function (err, res) { // eslint-disable-line
        res.should.have.status(200)
        res.should.be.json // eslint-disable-line
        res.body.should.be.a('object')
        res.body.should.have.property('_id')
        res.body.should.have.property('name')
        res.body.should.have.property('_rev')
        res.body.name.should.equal(testAccountName)
        res.body._id.should.equal('org.couchdb.user:' + testAccountName)
        done()
      })
  })

  it('should return an error message when requesting a user that does not exist on /api/users/<name> GET', function (done) {
    chai.request(server)
      .get('/api/users/' + secondTestAccountName)
      .end(function (err, res) { // eslint-disable-line
        res.should.have.status(404)
        res.should.be.json // eslint-disable-line
        res.body.should.be.a('object')
        res.body.should.have.property('name')
        res.body.should.have.property('errors')
        res.body.errors.should.have.property('name')
        done()
      })
  })

  it('should update a SINGLE user on /api/users/<name> PUT', function (done) {
    chai.request(server)
      .put('/api/users/' + testAccountName)
      .send({'name': testAccountName, 'password': 'secret2'})
      .end(function (err, res) { // eslint-disable-line
        res.should.have.status(200)
        res.should.be.json // eslint-disable-line
        res.body.should.be.a('object')
        res.body.should.have.property('id')
        res.body.should.have.property('ok')
        res.body.should.have.property('rev')
        res.body.ok.should.equal(true)
        res.body.id.should.equal('org.couchdb.user:' + testAccountName)
        done()
      })
  })

  it('should return an error message when the user being updated does not exist /api/users/<name> PUT', function (done) {
    chai.request(server)
      .put('/api/users/' + secondTestAccountName)
      .send({'name': secondTestAccountName, 'password': 'secret2'})
      .end(function (err, res) { // eslint-disable-line
        res.should.have.status(404)
        res.should.be.json // eslint-disable-line
        res.body.should.be.a('object')
        res.body.should.have.property('name')
        res.body.should.have.property('errors')
        res.body.errors.should.have.property('name')
        done()
      })
  })

  it('should delete a SINGLE user on /api/users/<name> DELETE', function (done) {
    chai.request(server)
      .delete('/api/users/' + testAccountName)
      .end(function (err, res) { // eslint-disable-line
        res.should.have.status(200)
        res.should.be.json // eslint-disable-line
        res.body.should.be.a('object')
        res.body.should.have.property('id')
        res.body.should.have.property('ok')
        res.body.should.have.property('rev')
        res.body.ok.should.equal(true)
        res.body.id.should.equal('org.couchdb.user:' + testAccountName)
        done()
      })
  })
})

it('should return an error message when the user being deleted does not exist /api/users/<name> DELETE', function (done) {
  chai.request(server)
    .delete('/api/users/' + secondTestAccountName)
    .end(function (err, res) { // eslint-disable-line
      res.should.have.status(404)
      res.should.be.json // eslint-disable-line
      res.body.should.be.a('object')
      res.body.should.have.property('name')
      res.body.should.have.property('errors')
      res.body.errors.should.have.property('name')
      done()
    })
})

describe('/', function () {
  it('should return a HTML page', function (done) {
    chai.request(server)
      .get('/')
      .end(function (err, res) {
        expect(err).to.equal(null)
        res.should.have.status(200)
        res.should.be.html // eslint-disable-line
        done()
      })
  })
})

describe('/config', function () {
  it('should return the App config', function (done) {
    chai.request(server)
      .get('/api/config')
      .end(function (err, res) {
        expect(err).to.equal(null)
        res.should.have.status(200)
        res.should.be.json // eslint-disable-line
        res.body.should.have.property('auth')
        res.body.should.have.property('access')
        res.body.should.have.property('currentUser')
        res.body.should.have.property('navigation')
        res.body.should.have.property('roles')
        res.body.should.have.property('usersTable')
        res.body.should.have.property('pagination')
        res.body.should.have.property('testPort')
        res.body.should.not.have.property('couch')
        done()
      })
  })
})
