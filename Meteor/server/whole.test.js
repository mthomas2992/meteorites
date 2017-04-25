import {Meteor} from 'meteor/meteor';
import { HTTP } from 'meteor/http';

var should = require('chai').should(),
expect = require('chai').expect,
supertest = require('supertest');
var testfile = "tests/bbtest.json";

api = supertest('http://localhost:3000');
 
describe("Basic Tests", function(){
	describe("Does isApiAlive return a 200?", function(){
		it("Returns a 200", function(done){
			api.get('/api/v2/isApiAlive')
			.set('Accept', 'application/json')
			.expect(200, done);
		});
	});
	describe("Does RetailAndExports return a 200?", function(){
		it("Returns a 200", function(done){
			api.get('/api/v2/isApiAlive')
			.set('Accept', 'application/json')
			.expect(200, done);
		});
	});
});

describe("Black Box Output Tester", function() {
	var testData = {};
	testData = JSON.parse(Assets.getText(testfile));
	var testNo = 1;
	for (var key in testData){
		if (testData.hasOwnProperty(key)){
			it(testNo + " Black Box test has passed", function(){
				api.get(key)
				.expect(200)
				.set('Accept', 'application/json')
				.end(function(err,res){
					Meteor.bindEnvironment(function(error,result){
						expect(res.body).to.eql(JSON.parse(Assets.getText(testData['tests/responses/'+key])));
					});
					expect(res.body).to.not.equal(null);
				});
			});
		}
	}
});



