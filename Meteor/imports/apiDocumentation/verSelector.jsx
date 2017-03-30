import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import Select from 'react-select';

class VerSelector extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        currentVersion:null,
        possibleVersions:null
      }
    };

    componentWillReceiveProps(nextProps){
      this.loadData(nextProps);
    }

    componentWillMount(){
      this.loadData(this.props);
    }

    loadData(loadingProps){
      var pV = new Array();
      for (i=0;i<=loadingProps.versionIndex.versions.length;i++){
        currElement = {value:loadingProps.versionIndex.versions[i],label:loadingProps.versionIndex.versions[i]};
        if (currElement.value == loadingProps.currentVersion){
          this.setState({currentVersion:currElement});
        }
        pV.push(currElement);
      }
      this.setState({possibleVersions:pV});
    }

    selectChange(){
      //we don't actually need ny code here at the moment since we don't have any other versions
    }

    render() {
      return (<div id ="verSelector">
                    <h3>Version</h3>
                    <Select
                    name= "version-selector"
                    value= {this.state.currentVersion}
                    options = {this.state.possibleVersions}
                    clearable = {false}
                    onChange = {this.selectChange.bind(this)}
                    />
            </div>)
    }
}

export default VerSelector;
