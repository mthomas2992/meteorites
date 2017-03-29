import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import NavBar from '/imports/apiDocumentation/navBar.jsx';
import MainBody from '/imports/apiDocumentation/mainBody.jsx';

class APIDocumentation extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        documentationIndex :null,
        currentVersion:null
      }
    };

    componentWillMount(){
      var self = this;
      Meteor.call('getApiDocumentationIndex', function(err,res){
        self.setState({documentationIndex:JSON.parse(res)});
        if (res.version){
          self.setState({currentVersion:res.version[res.version.length-1]}); //default to most recent version
        }
      });
    };


    render() {

      //if (this.props.version && this.props.endpoint)
      return (<div id="mainDocumentation" className="container-fluid">
              <div id="mainDocumentationTopHeaderRow" className="row">
                <div id="header" className="col-md-12">
                  Header
                </div>
                <div id="docoSpacer" className="col-md-12"></div>
              </div>
              <div id="mainDocumentationRow" className="row">
                <div className= "col-md-2 col-md-offset-1" id="navBarTop">
                  version selecter
                  <NavBar version={this.props.version} endpoint={this.props.endpoint}/>
                </div>
                <div id="mainBodyTop" className = "col-md-8 col-md-offset-1">
                  <h1>{this.props.endpoint}</h1>
                  <MainBody version={this.props.version} endpoint={this.props.endpoint}/>
                </div>
              </div>
            </div>);

    }
}

export default APIDocumentation;
