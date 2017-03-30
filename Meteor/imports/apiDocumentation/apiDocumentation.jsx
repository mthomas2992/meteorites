import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import NavBar from '/imports/apiDocumentation/navBar.jsx';
import MainBody from '/imports/apiDocumentation/mainBody.jsx';
import VerSelector from '/imports/apiDocumentation/verSelector.jsx';

class APIDocumentation extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        documentationIndex :null,
        currentVersion:null,
        endpoint:null
      }
    };

    componentWillReceiveProps(nextProps){
      this.loadData(nextProps);
    }

    componentWillMount(){
      this.loadData(this.props);
    };

    loadData(loadingProps){
      var self = this;
      Meteor.call('getApiDocumentationIndex', function(err,res){
        docIndex = JSON.parse(res);
        self.setState({documentationIndex:JSON.parse(res)});

        if (loadingProps){
          if (loadingProps.version){
            self.setState({currentVersion:loadingProps.version});
          } else {
            if (docIndex.versions){
              self.setState({currentVersion:docIndex.versions[docIndex.versions.length-1]}); //default to most recent version
            }
          }
          self.setState({endpoint:loadingProps.endpoint});
        } else {
          if (docIndex.versions){
            self.setState({currentVersion:docIndex.versions[docIndex.versions.length-1]}); //default to most recent version
          }
        }

      });
    }


    render() {
      var currEndpoint = this.state.endpoint;

      if (currEndpoint == null){
        currEndpoint = "Meteoristics API";
      }
      if (this.state.documentationIndex!=null && this.state.currentVersion!=null){
        return (<div id="mainDocumentation" className="container-fluid">
                <div id="mainDocumentationTopHeaderRow" className="row">
                  <div id="header" className="col-md-12">
                    Meteoristics: Api Docs
                  </div>
                  <div id="docoSpacer" className="col-md-12"></div>
                </div>
                <div id="mainDocumentationRow" className="row">
                  <div className= "col-md-2 col-md-offset-1" id="navBarTop">
                    <VerSelector versionIndex = {this.state.documentationIndex} currentVersion = {this.state.currentVersion} currentEndpoint={currEndpoint}/>
                    <NavBar version={this.state.currentVersion} endpoint={currEndpoint}/>
                  </div>
                  <div id="mainBodyTop" className = "col-md-8 col-md-offset-1">
                    <h1>{this.state.currentVersion +" " + currEndpoint}</h1>
                    <MainBody version={this.state.currentVersion} endpoint={currEndpoint}/>
                  </div>
                </div>
              </div>);
      } else {
        return (<div>Loading....</div>);
      }


    }
}

export default APIDocumentation;
