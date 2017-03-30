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

  function formatRetailOutput(data) {
    var mRD = new Array();
    var currIndustry = null;
    var currIndustryKey = null;
    var currState = null;
    var currStateKey = null;
    var rD = new Array();
    var monthsData = new Array();
    var currDate = null;

    for (i=0;i<data.structure.dimensions.observation[2].values.length;i++){ //for each region
      currIndustry = data.structure.dimensions.observation[2].values[i].name;
      currIndustryKey = i;
      rD=[];
      for (j=0;j<data.structure.dimensions.observation[0].values.length;j++){ //for each state
        currState = data.structure.dimensions.observation[0].values[j].name;
        currStateKey = j;
        monthsData = []; //reset months data array
        for (k=0;k<data.structure.dimensions.observation[5].values.length;k++){ //for each month
          currDate = data.structure.dimensions.observation[5].values[k].id;
          if (currDate.match(/-0[13578]/g) || currDate.match(/-1[02]/g)){ //add last day of month for the data
            currDate = currDate + "-31";
          } else if (currDate.match(/-02/g)) {
            currDate = currDate + "-28";
          } else {
            currDate = currDate + "-30";
          }
          if (data.dataSets[0].observations[currStateKey +":" +"0:"+currIndustryKey+":0:0:"+k]){
            monthsData.push({Date:currDate,Turnover: data.dataSets[0].observations[currStateKey +":" +"0:"+currIndustryKey+":0:0:"+k][0]});
          } else {
            monthsData.push({Date:currDate,Turnover: "Data missing"});
          }
        }
        rD.push({State:currState,Data:monthsData});
      }
      mRD.push({RetailIndustry:currIndustry,RegionalData:rD});
    }

    return mRD;
  }

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

// ****** API documentation ******
// http://www.abs.gov.au/ausstats/abs@.nsf/Lookup/1407.0.55.002Main+Features3User+Guide



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


    'getRetailTurnover' : function(stateString, industryString, startDate, endDate){
      //code for retail turnover here
      //console.log(stateString);
      var absQuery = "http://stat.data.abs.gov.au/sdmx-json/data/RT/";
      var stateArray = stateString.split(",");
      var i;
      var length = stateArray.length;
      for(i=0; i<length; i++){

        //console.log(stateArray[i]);

        if (stateArray[i].match(/NSW/gi)) {
          absQuery += "1";
        } else if (stateArray[i].match(/VIC/gi)) {
          absQuery += "2";
        } else if (stateArray[i].match(/QLD/gi)) {
          absQuery += "3";
        } else if (stateArray[i].match(/SA/gi)) {
          absQuery += "4";
        } else if (stateArray[i].match(/WA/gi)) {
          absQuery += "5";
        } else if (stateArray[i].match(/TAS/gi)) {
          absQuery += "6";
        } else if (stateArray[i].match(/NT/gi)) {
          absQuery += "7";
        } else if (stateArray[i].match(/ACT/gi)) {
          absQuery += "8";
        } else {
          absQuery +="MISTAKEHERE";
        }
        if (i < length - 1){
          absQuery += "+";
        }
      }
      absQuery += ".2.";

      var industryArray;
      industryArray = industryString.split(",");

      length = industryArray.length;
      for(i=0; i<length; i++){
          //parse industry list here
          if (industryArray[i].match(/Total/gi)) {
            absQuery += "20";
          } else if (industryArray[i].match(/FOOD/gi)) {
            absQuery += "41";
          } else if (industryArray[i].match(/HouseholdGood/gi)) {
            absQuery += "42";
          } else if (industryArray[i].match(/ClothingFootwareAndPersonalAccessory/gi)) {
            absQuery += "43";
          } else if (industryArray[i].match(/DepartmentStores/gi)) {
            absQuery += "44";
          } else if (industryArray[i].match(/CafesResturantsAndTakeawayFood/gi)) {
            absQuery += "45";
          } else if (industryArray[i].match(/Other/gi)) {
            absQuery += "46";
          } else {
            absQuery +="MISTAKEHERE";
          }
          if (i < length - 1){
            absQuery += "+";
        }
      }

      absQuery += ".10.M/all?startTime=";
      var startDateArray = startDate.split("-");
      absQuery += startDateArray[0];
      absQuery += "-"
      absQuery += startDateArray[1];
      absQuery += "&endTime=";
      var endDateArray = endDate.split("-");
      absQuery += endDateArray[0];
      absQuery += "-"
      absQuery += endDateArray[1];
      absQuery += "&dimensionAtObservation=allDimensions";

      var result = HTTP.get(absQuery);
      var newresult = JSON.parse(result.content);
      // console.log(newresult);
      var evenNewerResult = formatRetailOutput(newresult);
      return evenNewerResult;
      //return "To Be Completed";
    },

    'getMerchandiseExports' : function(stateString, commodityString, startDate, endDate){
      //code for Merchandise exports turnover here
            var absQuery = "http://stat.data.abs.gov.au/sdmx-json/data/MERCH_EXP/";

      var stateArray = stateString.split(",");
      var i;
      var length = stateArray.length;
      for(i=0; i<length; i++){

        //console.log(stateArray[i]);

        if (stateArray[i].match(/AUS/gi)) {
          absQuery += "-";
        } else if (stateArray[i].match(/NSW/gi)) {
          absQuery += "1";
        } else if (stateArray[i].match(/VIC/gi)) {
          absQuery += "2";
        } else if (stateArray[i].match(/QLD/gi)) {
          absQuery += "3";
        } else if (stateArray[i].match(/SA/gi)) {
          absQuery += "4";
        } else if (stateArray[i].match(/WA/gi)) {
          absQuery += "5";
        } else if (stateArray[i].match(/TAS/gi)) {
          absQuery += "6";
        } else if (stateArray[i].match(/NT/gi)) {
          absQuery += "7";
        } else if (stateArray[i].match(/ACT/gi)) {
          absQuery += "8";
        } else {
          absQuery +="MISTAKEHERE";
        }
        if (i < length - 1){
          absQuery += "+";
        }
      }
      absQuery += ".";


      var commodityArray;
      commodityArray = commodityString.split(",");
      length = commodityArray.length;
      for(i=0; i<length; i++){
          //parse commodity list here
          if (commodityArray[i].match(/TOTAL/gi)) {
            absQuery += "-1";
          } else if (commodityArray[i].match(/FoodAndLiveAnimals/gi)) {
            absQuery += "0";
          } else if (commodityArray[i].match(/BeveragesAndTobacco/gi)) {
            absQuery += "1";
          } else if (commodityArray[i].match(/CrudMaterialAndInedible/gi)) {
            absQuery += "2";
          } else if (commodityArray[i].match(/MineralFuelLubricentAndRelatedMaterial/gi)) {
            absQuery += "3";
          } else if (commodityArray[i].match(/AnimalAndVegitableOilFatAndWaxes/gi)) {
            absQuery += "4";
          } else if (commodityArray[i].match(/ChemicalsAndRelatedProducts/gi)) {
            absQuery += "5";
          } else if (commodityArray[i].match(/ManufacutedGoods/gi)) {
            absQuery += "6";
          } else if (commodityArray[i].match(/MachineryAndTransportEquipments/gi)) {
            absQuery += "7";
          } else if (commodityArray[i].match(/OtherManucacturedArticles/gi)) {
            absQuery += "8";
          } else if (commodityArray[i].match(/Unclassified/gi)) {
            absQuery += "9 ";
          } else {
            absQuery +="MISTAKEHERE";
          }
          if (i < length - 1){
            absQuery += "+";
        }
      }
      absQuery += ".-1.-.M/all?startTime=";

      var startDateArray = startDate.split("-");
      absQuery += startDateArray[0];
      absQuery += "-"
      absQuery += startDateArray[1];
      absQuery += "&endTime=";
      var endDateArray = endDate.split("-");
      absQuery += endDateArray[0];
      absQuery += "-"
      absQuery += endDateArray[1];
      absQuery += "&dimensionAtObservation=allDimensions";

      var result = HTTP.get(absQuery);
      var newresult = JSON.parse(result.content);
      // console.log(newresult);
      var evenNewerResult = formatRetailOutput(newresult);
      return evenNewerResult;

    }


  })
});
