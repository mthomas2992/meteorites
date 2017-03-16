import React from 'react';
import ReactDOM from 'react-dom';
import App from '/imports/app';

FlowRouter.route('/', {
  action(params, queryParams) {
    ReactDOM.render(<App path="Home" />, document.getElementById('app'));
  }
});

FlowRouter.notFound = {
  action(){
    ReactDOM.render(<App path="404"/>,document.getElementById('app'));
  }
}
