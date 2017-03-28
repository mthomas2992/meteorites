import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import showdown from 'showdown';

Meteor.startup(() => {

////////////////////////////////////////////////////////////////////////////////
///////////////////////////      API SECTION     ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  // API config, default routes have domain/api/<route>
  var Api = new Restivus({
    version:'v1',
    useDefaultAuth: true,
    prettyJson: true
  });

  //convert a given list of required values into regex
  function createListRequirementRegex(possibleValues){
    var regexString="((";
    for (i=0;i<possibleValues.length;i++){
      if (i!=0){
        regexString=regexString + "|"+possibleValues[i];
      } else {
        regexString=regexString + possibleValues[i];
      }
    };
    regexString=regexString+")(,+|$))+";
    return regexString;
  };

  //pass this function a set of requirements and a query and it will check the query fulfils it
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
          errorStack.push(unexpectedError);
        } else {
          if (regex[0]!=regex['input']){ //if the regex matches multiples as opposed to one single match, useful for list checking
            errorStack.push(unexpectedError);
          }
        }
      }
    };

    if (requirements.length<Object.keys(queryParams).length){
      warningStack.push({code:01, warningDetails:"Unnessasary paramaters detected, some given paramaters are not needed"});
    };

    var response = {requirements:requirements,errors:errorStack,warnings:warningStack};
    return response;
  };

  //add routes to the API here

  //basic is api working route
  Api.addRoute('isApiAlive', {authRequired: false}, {
    get: function () {
      return {statusCode:200, body:{status:'Success', message:'Yes'}};
    }
  });

  Api.addRoute('retailTrade', {authRequired: false}, {
    get: function () {
      var possibleStatisticsArea = ["Retail","MerchandiseExports"];
      var possibleState = ["AUS","NSW","WA","SA","ACT","VIC","TAS","QLD","NT"];
      var possibleCategoryRetail = ["Total","Food","Householdgood","ClothingFootwareAndPersonalAccessory","DepartmentStores","CafesResturantsAndTakeawayFood","Other"]
      var possibleCategoryMerchandise = ["Total","FoodAndLiveAnimals","BeveragesAndTobacco","CrudMaterialAndInedible","MineralFuelLubricentAndRelatedMaterial","AnimalAndVegitableOilFatAndWaxes","ChemicalsAndRelatedProducts","ManufacutedGoods","MachineryAndTransportEquipments","OtherManucacturedArticles","Unclassified"]

      if (this.queryParams.statisticsArea.match(/retail/gi)){
        var requirements = [{name:"statisticsArea", expected: new RegExp(createListRequirementRegex(possibleStatisticsArea),'gi'),possibles:"one or multiple of "+possibleStatisticsArea.toString(),required:true},
                            {name:"state", expected: new RegExp(createListRequirementRegex(possibleState),'gi'),possibles:"one or multiple of "+possibleState.toString(),required:true},
                            {name:"category", expected: new RegExp(createListRequirementRegex(possibleCategoryRetail),'gi'), possibles:"one or multiple of "+possibleCategoryRetail.toString(), required:true},
                            {name:"startDate", expected: new RegExp('....-..-..','gi'), possibles:"date in format YYYY-MM-DD", required:true},
                            {name:"endDate",expected: new RegExp('....-..-..','gi'), possibles:"date in format YYYY-MM-DD", required:true}];
      } else if (this.queryParams.statisticsArea.match(/MerchandiseExports/gi)){
        var requirements = [{name:"statisticsArea", expected: new RegExp(createListRequirementRegex(possibleStatisticsArea),'gi'),possibles:"one or multiple of "+possibleStatisticsArea.toString(),required:true},
                            {name:"state", expected: new RegExp(createListRequirementRegex(possibleState),'gi'),possibles:"one or multiple of "+possibleState.toString(),required:true},
                            {name:"category", expected: new RegExp(createListRequirementRegex(possibleCategoryMerchandise),'gi'), possibles:"one or multiple of "+possibleCategoryMerchandise.toString(), required:true},
                            {name:"startDate", expected: new RegExp('....-..-..','gi'), possibles:"date in format YYYY-MM-DD", required:true},
                            {name:"endDate",expected: new RegExp('....-..-..','gi'), possibles:"date in format YYYY-MM-DD", required:true}];
      } else { //these requirements will be failed
        var requirements = [{name:"statisticsArea", expected: new RegExp(createListRequirementRegex(possibleStatisticsArea),'gi'),possibles:"one or multiple of "+possibleStatisticsArea.toString(),required:true}];
      }


      var errorsAndWarnings = checkRequirements(requirements,this.queryParams);
      if (errorsAndWarnings.errors.length!=0){
        return {statusCode:400, body:{status:errorsAndWarnings, data:'Errors prevented data request, check the status field'}}
      } else {
        //execute safe logic
        var state = this.queryParams.state;
        var category = this.queryParams.category;
        var startDate = this.queryParams.startDate;
        var endDate = this.queryParams.endDate;
        if (this.queryParams.statisticsArea.match(/retail/gi)){
          var data = Meteor.call('getRetailTurnover',state,category,startDate,endDate);
        } else {
          var data = Meteor.call('getMerchandiseExports',state,category,startDate,endDate);
        }
        if(data!=null){ //add further testing for whether the call failed here TODO
          return {statusCode:200, body:{status:errorsAndWarnings, data:data}};
        }
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
*/

  Meteor.methods ({

    'testAPIAccess' :function (){
      var queryString = "http://stat.data.abs.gov.au/sdmx-json/data/RT/0.2+1.20+41+42+43+44+45+46.10+20+30.M/all?startTime=2016-02&endTime=2017-01&dimensionAtObservation=allDimensions&pid=28a5828e-8915-407f-8244-4c4a8635b29c"
      var result = HTTP.get(queryString);
      var newresult = JSON.parse(result.content);
      console.log(newresult);
      return newresult;
    },


    'getApiDocumentationIndex' : function(){
      return Assets.getText('Index.txt');
    },

    'getApiVersionIndex' :function(version){
      return JSON.parse(Assets.getText(version+'/versionIndex.txt'));
    },

    'getDocumentationPageContents' : function(version,endpoint){
      var converter = new showdown.Converter();
      return converter.makeHtml(Assets.getText(version+'/'+endpoint+'.txt'));
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
      return("stubbed");
    }


  })
});
