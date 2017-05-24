import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import JSONTree from 'react-json-tree';

class App extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        meteoristicsData:{"Loading Meteoristics data":"Loading"},
        foriegnData:{"Loading other teams data":"Loading"}
      }

    };

    componentWillMount(){
      var self=this;
      Meteor.call('runMeteoristicsTests',function(err,res){
        self.setState({meteoristicsData:res});
        Meteor.call('runOtherTests',function(err,res){
          self.setState({foriegnData:res});
        })
      });

    }


    render() {
      const theme = {
        scheme: 'monokai',
        author: 'wimer hazenberg (http://www.monokai.nl)',
        base00: '#272822',
        base01: '#383830',
        base02: '#49483e',
        base03: '#75715e',
        base04: '#a59f85',
        base05: '#f8f8f2',
        base06: '#f5f4f1',
        base07: '#f9f8f5',
        base08: '#f92672',
        base09: '#fd971f',
        base0A: '#f4bf75',
        base0B: '#a6e22e',
        base0C: '#a1efe4',
        base0D: '#66d9ef',
        base0E: '#ae81ff',
        base0F: '#cc6633'
      };

      return (<div>
              <h1> Meteoristics Test results</h1>
              <JSONTree data={this.state.meteoristicsData} theme={theme}/>
              <h1> Other Team's test results</h1>
              <JSONTree data={this.state.foriegnData} theme={theme}/>
              </div>)
    }
}

export default App;
