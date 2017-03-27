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

  //add routes to the API here
  Api.addRoute('test', {authRequired: false}, {
    get: function () {
      return {statusCode:202, body:{status:'Success', message:'Test success'}};
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
      var queryString = "http://stat.data.abs.gov.au/sdmx-json/data/RT/0.2+1.20+41+42+43+44+45+46.10+20+30.M/all?startTime=2016-01&endTime=2017-01"
      var result = HTTP.get(queryString);
      var newresult = JSON.parse(result.content);
      console.log(newresult);
      return newresult;
    }


  })
});
