import {Meteor} from 'meteor/meteor';
import { HTTP } from 'meteor/http';

var diff = require('deep-diff').diff;
var observableDiff = require('deep-diff').observableDiff;
expect = require('chai').expect

const rootUrl = "http://meteoristics.com/api/";

//function that will compare alpha and beta, ignoring the keys and their children of the array keystoignore
function JSONComparator(fileAlpha,fileBeta,keysToIgnore){
  var diffRes = observableDiff(fileAlpha,fileBeta,function(expected){
    if (expected.path==undefined){
      expect(expected.rhs).to.equal(expected.lhs);
    } else {
      expect(expected.path.join(".")).to.equal(expected.lhs);
    }
  },function(path,key){
    for (l=0;l<keysToIgnore.length;l++){
      if (key == keysToIgnore[l]){
        return true;
      }
    }
  });
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
        console.log(currEndpointTesting.tests[k]);
        var testFile = JSON.parse(Assets.getText("tests/"+curr.versionID+"/blackbox/"+currEndpointTesting.endpoint+"/"+currEndpointTesting.tests[k]+".json"));
        //console.log(testFile);
        it (testFile.Name, function (){
            var test=HTTP.get(rootUrl+curr.versionID+testFile.Query);
            JSONComparator(testFile.Expected,test,["status"]);
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
