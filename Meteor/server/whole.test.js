import {Meteor} from 'meteor/meteor';
import { HTTP } from 'meteor/http';

var should = require('chai').should(),
expect = require('chai').expect,
supertest = require('supertest'),

api = supertest('http://localhost:3000');
 
describe("Basic Tests", function(){
	describe("Does it return a 200?", function(){
		it("Returns a 200", function(done){
			api.get('/api/v2/isApiAlive')
			.set('Accept', 'application/json')
			.expect(200, done);
		});
	});

	/*describe("Does JSON returned have keys and values ", function(done){
		api.get('/api/v2/')
		.set('Accept', 'application/json')
		.expect(200)
		.end(function(err, res){
			expect(res.body).to.have.property("")
		}
	}*/
});

describe("Initial Output Tester", function() {
	describe("Test Case 1", function() {
		it("Returns expected output", function(){
			var tests = Assets.getText("tests/t1.test");
			var test1 = "http://meteoristics.com/api/v2/RetailAndExports?statisticsArea=Retail&state=nsw&category=Food&startDate=2015-09-09&endDate=2016-09-09";		
			api.get('api/v2/RetailAndExports?statisticsArea=Retail&state=nsw&category=Food&startDate=2015-09-09&endDate=2016-09-09')
			.expect(200)
			.end(function(err, res){
				expect(res.body).to.eql(tests);
				expect(res.body).to.not.equal(null);
				done();
			});
		});
	});
});


describe("test case 2", function(){
	it("does the thing, surely", function(){
		expect('1').to.equal('1');
	});
});	