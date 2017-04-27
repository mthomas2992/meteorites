import { Meteor } from 'meteor/meteor';

var diff = require('deep-diff').diff;
var observableDiff = require('deep-diff').observableDiff;

const rootMeteoristics = "http://meteoristics.com/api/";



Meteor.startup(() => {
  Meteor.methods ({
    'runMeteoristicsTests' :function (){
      var testIndex = JSON.parse(Assets.getText("tests/index.json"));
      var masterJS = {};
      for (i=0;i<testIndex.versions.length;i++){ //for each version
        var curr = testIndex.versions[i];
        masterJS[curr.versionID]={};
        for (j=0;j<curr.blackBoxTests.length;j++){ //for each of the endpoints
          var currEndpointTesting = curr.blackBoxTests[j];
          var endpointResults = new Array();
          for (k=0;k<currEndpointTesting.tests.length;k++){ //for each of the endpoints tests
            var testFile = JSON.parse(Assets.getText("tests/"+curr.versionID+"/blackbox/"+currEndpointTesting.endpoint+"/"+currEndpointTesting.tests[k]+".json"));
            var startTime = process.hrtime();
            var test=HTTP.get(rootMeteoristics+curr.versionID+testFile.Query);
            var duration = process.hrtime(startTime);
            var result =Meteor.call('JSONComparator',testFile.Expected,test,[]);
            endpointResults.push ({testName:testFile.Name,desc:testFile.Description,result:result,duration:duration});
          }
          masterJS[curr.versionID][currEndpointTesting.endpoint]=endpointResults;
        }
      }
      return masterJS;
    },

    'JSONComparator' : function (fileAlpha,fileBeta,keysToIgnore){
      var returningString="";
      var diffRes = observableDiff(fileAlpha,fileBeta,function(expected){
        if (expected.path==undefined){
          returningString= returningString + "expected " +expected.rhs;
        } else {
          returningString= returningString + "failed at " +expected.path.join(".");
        }
      },function(path,key){
        for (l=0;l<keysToIgnore.length;l++){
          if (key == keysToIgnore[l]){
            return true;
          }
        }
      });
      return returningString;
    }
  });
});
