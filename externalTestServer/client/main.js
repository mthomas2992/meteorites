import React from 'react';
import ReactDOM from 'react-dom';

import App from '/imports/app.jsx';

Meteor.startup(() => {

  //no longer replace tag here, we do it in the routes instead
	ReactDOM.render(<App/>, document.getElementById('app'));

});
