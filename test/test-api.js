
/* global it */
/* global describe */
/* global require */
/* jshint node: true */

'use strict';


var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

var testAccountName = 'chai_latte_with_cinnamon'.replace(/\s/g, '-');
var secondTestAccountName = 'vanilla_latte_without_cinnamon';


describe('/api/users', function() {
  it('should list ALL users on /api/users GET', function(done) {
    chai.request(server)
      .get('/api/users')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
      });
  });

  it('should add a SINGLE user on /api/users POST', function(done) {
    chai.request(server)
      .post('/api/users')
      .send({'name': testAccountName, 'password': 'secret'})
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('name');
        res.body.should.have.property('_id');
        res.body.should.have.property('_rev');
        res.body.name.should.equal(testAccountName);
        res.body._id.should.equal('org.couchdb.user:' +  testAccountName);
        done();
      });

  });

  it('should return an error message when trying to create a user that already exists on /api/users POST', function(done) {
    chai.request(server)
      .post('/api/users')
      .send({'name': testAccountName, 'password': 'secret'})
      .end(function(err, res){
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('name');
        res.body.should.have.property('errors');
        res.body.name.should.equal('ValidationError');
        res.body.errors.name.should.equal('unique');
        done();
      });

  });


  it('should list a SINGLE user on /api/users/<name> GET', function(done) {
    chai.request(server)
      .get('/api/users/' + testAccountName)
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        res.body.should.have.property('name');
        res.body.should.have.property('_rev');
        res.body.name.should.equal(testAccountName);
        res.body._id.should.equal('org.couchdb.user:' + testAccountName);
        done();
      });
  });

  it('should return an error message when requesting a user that does not exist on /api/users/<name> GET', function(done) {
    chai.request(server)
      .get('/api/users/' + secondTestAccountName)
      .end(function (err, res) {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('name');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('name');
        done();
      });
  });


  it('should update a SINGLE user on /api/users/<name> PUT', function (done) {
    chai.request(server)
      .put('/api/users/' + testAccountName)
      .send({'name': testAccountName, 'password': 'secret2'})
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('ok');
        res.body.should.have.property('rev');
        res.body.ok.should.equal(true);
        res.body.id.should.equal('org.couchdb.user:' + testAccountName);
        done();
      });
  });


  it('should return an error message when the user being updated does not exist /api/users/<name> PUT', function (done) {
    chai.request(server)
      .put('/api/users/' +secondTestAccountName)
      .send({'name': secondTestAccountName, 'password': 'secret2'})
      .end(function (err, res) {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('name');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('name');
        done();
      });
  });

  it('should delete a SINGLE user on /api/users/<name> DELETE', function (done) {
    chai.request(server)
      .delete('/api/users/' + testAccountName)
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('ok');
        res.body.should.have.property('rev');
        res.body.ok.should.equal(true);
        res.body.id.should.equal('org.couchdb.user:' + testAccountName);
        done();
      });
  });
});

it('should return an error message when the user being deleted does not exist /api/users/<name> DELETE', function (done) {
  chai.request(server)
    .delete('/api/users/' +secondTestAccountName)
    .end(function (err, res) {
      res.should.have.status(404);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('name');
      res.body.should.have.property('errors');
      res.body.errors.should.have.property('name');
      done();
    });
});

describe('/', function() {
  it('should return a HTML page', function (done) {
    chai.request(server)
      .get('/')
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
      });
  });
});