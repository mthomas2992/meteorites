import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

  var Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
  });

  Api.addRoute('test', {authRequired: false}, {
    get: function () {
      console.log("called");
      return {statusCode:202, body:{status:'Success', message:'Test success'}};
    }
  });

});
