import { Meteor } from 'meteor/meteor';

var diff = require('deep-diff').diff;
var observableDiff = require('deep-diff').observableDiff;

const rootMeteoristics = "http://meteoristics.com/api/";


Meteor.startup(() => {
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

    return null;
  }
  Meteor.methods ({
    'runMeteoristicsTests' :function (){
      //function that will compare alpha and beta, ignoring the keys and their children of the array keystoignore


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
                  var test=HTTP.get(rootMeteoristics+curr.versionID+testFile.Query);
                  JSONComparator(testFile.Expected,test,[]);
              })
            }
          })
        }

      }
    },
  });
});
