import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

Meteor.startup(() => {

////////////////////////////////////////////////////////////////////////////////
///////////////////////////      API SECTION     ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  // API config, default routes have domain/api/<route>
  var Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
  });

  function checkRequirements(requirements,queryParams){
    var errorStack = new Array();
    var warningStack = new Array();
    for (i=0;i<requirements.length;i++){ //for each requirment of the given query
      var currReq = requirements[i]; //set current
      if (!queryParams[currReq.name] && currReq.required){ //if no queryParamater is detected that matches and it is a required query
        errorStack.push({code:101, errorDetails:"\""+currReq.name+"\" is a required variable for this request, can be "+currReq.possibles});
      } else if (queryParams[currReq.name]){ //if a query paramater does exist
        var regex = currReq.expected.exec(queryParams[currReq.name]); //execute regex
        var unexpectedError = {code:100, errorDetails:"Unexpected data value for \""+currReq.name+ "\", recieved \""+queryParams[currReq.name]+"\"expected "+currReq.possibles}
        if (regex == null){ //if there are no matches to the regex at all
          console.log(currReq.expected.exec(queryParams[currReq.name]));
          errorStack.push(unexpectedError);
        } else {
          if (regex[0]!=regex['input']){ //if the regex matches multiples as opposed to one single match, useful for list checking
            errorStack.push(unexpectedError);
          }
        }
      }
    }
    if (requirements.length<queryParams.length){
      errorStack.push({code:01, warningDetails:"Unnessasary paramaters detected, some given paramaters are not needed"});
    }
    var response = {requirements:requirements,errors:errorStack,warnings:warningStack};
    return response;
  };

  //add routes to the API here
  Api.addRoute('test', {authRequired: false}, {
    get: function () {
      return {statusCode:202, body:{status:'Success', message:'Test success'}};
    }
  });

  Api.addRoute('retailTrade', {authRequired: false}, {
    get: function () {
      //var expectedAreas = ["Retail","MerchandiseExports"];
      var requirements = [{name:"statisticsArea", expected: new RegExp('(Retail|MerchandiseExports)','gi'),possibles:"one or multiple of \"Retail,MerchandiseExports\"",required:true},
                          {name:"state", expected: new RegExp('((AUS|NSW|WA|SA|ACT|VIC|TAS|QLD|NT)(,+|$))+','gi'),possibles:"one or multiple of \"AUS,NSW,WA,SA,ACT,VIC,TAS,QLD,NT\"",required:true},
                          {name:"category", expected: new RegExp('(.*)'), possibles:"stubbed", required:true},
                          {name:"startDate", expected: new RegExp('(.*)'), possibles:"stubbed", required:true},
                          {name:"endDate",expected: new RegExp('(.*)'), possibles:"stubbed", required:true}];

      var errorsAndWarnings = checkRequirements(requirements,this.queryParams);
      if (errorsAndWarnings.errors.length!=0){
        return {statusCode:400, body:{status:errorsAndWarnings, data:'Errors prevented data request, check the status field'}}
      } else {
        //execute safe logic
        var state = this.queryParams.state;
        var category = this.queryParams.category;
        var startDate = this.queryParams.startDate;
        var endDate = this.queryParams.endDate;
        return {statusCode:202, body:{status:'Success', message:'Test success'}};
      }
    }
  });

////////////////////////////////////////////////////////////////////////////////
///////////////////////////      ENDAPI          ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//add server side methods to be called with Meteor.call here
// add API calls to ABS here

/// ***************** API calls to ABS *****************

// ****** API documentation ******
// http://www.abs.gov.au/ausstats/abs@.nsf/Lookup/1407.0.55.002Main+Features3User+Guide

/*

Parameter A - by region

http://stat.data.abs.gov.au/sdmx-json/data/RT/0.2+1.20+41+42+43+44+45+46.10+20+30.M/all?startTime=2016-02&endTime=2017-01&dimensionAtObservation=allDimensions

Parameter B - Retail Industry Type

http://stat.data.abs.gov.au/sdmx-json/data/RT/0.2+1.20+41+42+43+44+45+46.10+20+30.M/all?startTime=2016-02&endTime=2017-01&dimensionAtObservation=allDimensions

Parameter C - Time & Frequency

http://stat.data.abs.gov.au/sdmx-json/data/RT/0.2+1.20+41+42+43+44+45+46.10+20+30.M/all?startTime=2016-01&endTime=2017-01

Example API call:
// returns a list of ALBUMS
  'getNewReleases' : function(authToken){
    const options = {
      "params": {
        "limit": "30",
        "country": "AU"
      },
      "headers" : {
        "Authorization": "Bearer " + authToken
      }
    }
    console.log("Called getNewReleases");
    var result = HTTP.get("https://api.spotify.com/v1/browse/new-releases", options);
    // console.log("THIS IS YOUR RESULT:\n")
    // console.log(result);
    return result;
  },

*/

  Meteor.methods ({

    'testAPIAccess' :function (){
      var queryString = "http://stat.data.abs.gov.au/sdmx-json/data/RT/0.2+1.20+41+42+43+44+45+46.10+20+30.M/all?startTime=2016-02&endTime=2017-01&dimensionAtObservation=allDimensions&pid=28a5828e-8915-407f-8244-4c4a8635b29c"
      var result = HTTP.get(queryString);
      var newresult = JSON.parse(result.content);
      console.log(newresult);
      return newresult;
    },

    'getRetailTurnover' : function(){
      //code for retail turnover here
    },

    'getMerchandiseExports' : function(){
      //code for Merchandise exports turnover here
    }


  })
});
