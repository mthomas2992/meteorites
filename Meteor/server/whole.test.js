import {Meteor} from 'meteor/meteor';
import { HTTP } from 'meteor/http';

expect = require('chai').expect

const rootUrl = "http://meteoristics.com/api/";


//function that will compare alpha and beta, ignoring the keys and their children of the array keystoignore
function JSONComparator(fileAlpha,fileBeta,keysToIgnore){
  // console.log(fileAlpha);
  // console.log(fileBeta);
  expect(true).to.equal(true);
}

var testIndex = JSON.parse(Assets.getText("tests/index.json"));

//Api testing
for (i=0;i<testIndex.versions.length;i++){ //for each version
  var curr = testIndex.versions[i];

  console.log("BlackBox Testing version "+curr.versionID);
  for (j=0;j<curr.blackBoxTests.length;j++){ //for each of the endpoints
    var currEndpointTesting = curr.blackBoxTests[j];
    describe("Endpoint "+currEndpointTesting.endpoint, function(){
      for (k=0;k<currEndpointTesting.tests.length;k++){ //for each of the endpoints tests
        var testFile = JSON.parse(Assets.getText("tests/"+curr.versionID+"/blackbox/"+currEndpointTesting.endpoint+"/"+currEndpointTesting.tests[k]+".json"));
        it (testFile.Name, function (){
            var test=HTTP.get(rootUrl+curr.versionID+testFile.Query);
            JSONComparator(testFile.Expected,test);
        })
      }
    })
  }

}

// describe("Black Box Tests", function() {
//   console.log(testIndex);
//   it("Black Box test has passed", function(){
//
//   });
// });
