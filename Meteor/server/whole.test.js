import {Meteor} from 'meteor/meteor';
import { HTTP } from 'meteor/http';

var chai = require('chai')
  , chaiJsonEqual = require('chai-json-equal');

chai.use(chaiJsonEqual);


describe("Initial Output Tester", function() {
	describe("Test Case 1", function() {
		it("Returns expected output", function(){
			var tests = JSON.parse(Assets.getText("tests/t1.test"));
			var test1 = "http://meteoristics.com/api/v2/RetailAndExports?statisticsArea=Retail&state=nsw&category=Food&startDate=2015-09-09&endDate=2016-09-09";		
			var ret = JSON.parse(HTTP.get(test1));
			chai.expect(tests).to.equal(ret);
		});
	});
});
describe("test case 2", function(){
	it("does the thing, surely", function(){
		chai.expect('1').to.equal('1');
	});
});	