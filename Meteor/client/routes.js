import React from 'react';
import ReactDOM from 'react-dom';
import App from '/imports/app/app.jsx';
import APIDocumentation from '/imports/apiDocumentation/apiDocumentation.jsx';
import ApiExplorer from '/imports/apiDocumentation/explorer.jsx';
import D3Test from '/imports/app/d3test.jsx';

FlowRouter.route('/', {
  action(params, queryParams) {
    //ReactDOM.render(<APIDocumentation version={queryParams.ver} endpoint={queryParams.endpoint}/>, document.getElementById('app'));

    ReactDOM.render(<App path="Home" />, document.getElementById('app'));
  }
});

FlowRouter.route('/impact', {
  action(params, queryParams) {
    // ReactDOM.render(<APIDocumentation version={queryParams.ver} endpoint={queryParams.endpoint}/>, document.getElementById('app'));

    ReactDOM.render(<App path="impact" queryParams={queryParams}/>, document.getElementById('app'));
  }
});

FlowRouter.route('/custom', {
  action(params, queryParams) {
    // ReactDOM.render(<APIDocumentation version={queryParams.ver} endpoint={queryParams.endpoint}/>, document.getElementById('app'));

    ReactDOM.render(<App path="Custom" queryParams={queryParams}/>, document.getElementById('app'));
  }
});

FlowRouter.route('/explorer', {
  action(params, queryParams) {
    ReactDOM.render(<App path="Explorer" queryParams={queryParams}/>, document.getElementById('app'));
  }
});

//Api documentation routes are defined for a different app
FlowRouter.route('/api/documentation', {
  action(params,queryParams) {
    ReactDOM.render(<APIDocumentation version={queryParams.ver} endpoint={queryParams.endpoint}/>, document.getElementById('app'));
  }
});


FlowRouter.route('/api/explorer', {
  action(params,queryParams) {
    ReactDOM.render(<ApiExplorer version={queryParams.ver} endpoint={queryParams.endpoint}/>, document.getElementById('app'));
  }
});

FlowRouter.notFound = {
  action(){
    ReactDOM.render(<App path="404"/>,document.getElementById('app'));
  }
}
