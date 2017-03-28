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

  Api.addRoute('retailTrade', {authRequired: false}, {
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
      var queryString = "http://stat.data.abs.gov.au/sdmx-json/data/RT/0.2+1.20+41+42+43+44+45+46.10+20+30.M/all?startTime=2016-02&endTime=2017-01&dimensionAtObservation=allDimensions&pid=28a5828e-8915-407f-8244-4c4a8635b29c"
      var result = HTTP.get(queryString);
      var newresult = JSON.parse(result.content);
      console.log(newresult);
      return newresult;
    },

    'getRetailTurnover' : function(stateList, industryList, startDate, endDate){
      //code for retail turnover here
      var absQuery = "";
      var stateArray = stateList.split(",");
      var i;
      var length = stateArray.length;
      for(i=0; i<length; i++){

        if (stateList[i] == "AUS") {
          absQuery += "0";
        } else if (stateList[i] == "NSW") {
          absQuery += "1";
        } else if (stateList[i] == "VIC") {
          absQuery += "2";
        } else if (stateList[i] == "QLD") {
          absQuery += "3";
        } else if (stateList[i] == "SA") {
          absQuery += "4";
        } else if (stateList[i] == "WA") {
          absQuery += "5";
        } else if (stateList[i] == "TAS") {
          absQuery += "6";
        } else if (stateList[i] == "NT") {
          absQuery += "7";
        } else if (stateList[i] == "ACT") {
          absQuery += "8";
        } else {
          absQuery +="MISTAKEHERE";
        }
        if (i < length - 1){
          absQuery += "+";
        }
      }
      absQuery += ".2";

      var industryArray;
      industryArray = industryList.split(",");

      length = industryArray.length;
      for(i=0; i<length; i++){
          //parse industry list here
          if ("Total") {

          } else if ("Food") {

          } else if ("HouseholdGood") {

          } else if ("ClothingFootwareAndPersonalAccessory") {

          } else if ("DepartmentStores") {

          } else if ("CafesResturantsAndTakeawayFood") {

          } else if ("Other") {

          } else {
            absQuery +="MISTAKEHERE";
          }
      }

      absQuery += ".10.M";

      return "To Be Completed";
    },

    'getMerchandiseExports' : function(){
      //code for Merchandise exports turnover here
    }


  })
});
