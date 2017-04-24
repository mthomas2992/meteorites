import {Meteor} from 'meteor/meteor';
import { HTTP } from 'meteor/http';

var expect = require("chai").expect;
var jsonEqual = require('chai-json-equal');
describe("Initial Output Tester", function() {
	describe("Test Case 1" function() {
		it("Returns expected output", function(){
			var tests = JSON.parse(Assets.getText("t1.test"));
			var test1 = "http://meteoristics.com/api/v2/RetailAndExports?statisticsArea=Retail&state=nsw&category=Food&startDate=2015-09-09&endDate=2016-09-09";		


			expect(tests).to.jsonEqual(JSON.parse(HTTP.get(test1)));
			}

		});
	});
});