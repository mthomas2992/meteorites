import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import JSONTree from 'react-json-tree';

class ApiExplorer extends React.Component {

    constructor(props){
      super(props);

      this.state = {
        queryString:null,
        loadingResponse:false,
        response:null,
      }

      this.handleChange= this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

    };

    handleChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name;

      if (value.match(/script/gi)){
        return;
      }
      this.setState({
        [name]: value
      });
    };

    handleSubmit(event){
      event.preventDefault();
      var self =this;
      this.setState({loadingResponse:true});
      Meteor.call('makeHttpRequest',"http://meteoristics.com/api/v2/"+this.state.queryString,function (err,res){
        self.setState({response:res});
        self.setState({loadingResponse:false});
      });
    }

    componentDidMount(){

    };

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

      if (this.state.response == null && this.state.loadingResponse==false){
        return (<div>
                    <form onSubmit={this.handleSubmit}>
                      http://meteoristics.com/api/v2/<input id="formInput" name= "queryString" type="text" value = {this.state.queryString} onChange={this.handleChange} placeholder={"Enter your query string here"}/>
                      <input type="submit" value="Submit query" id="submitButton"/>
                    </form>
                </div>)
      } else if (this.state.loadingResponse==true){
        return (<div>
                  <div>
                    <form onSubmit={this.handleSubmit}>
                      http://meteoristics.com/api/v2/<input id="formInput" name= "queryString" type="text" value = {this.state.queryString} onChange={this.handleChange} placeholder={"Enter your query string here"}/>
                      <input type="submit" value="Submit query" id="submitButton"/>
                    </form>
                  </div>
                  <div>
                    sending your request...
                  </div>
                </div>)
      } else if (this.state.response) {
        return (<div>
                  <div>
                    <form onSubmit={this.handleSubmit}>
                      http://meteoristics.com/api/v2/<input id="formInput" name= "queryString" type="text" value = {this.state.queryString} onChange={this.handleChange} placeholder={"Enter your query string here"}/>
                      <input type="submit" value="Submit query" id="submitButton"/>
                    </form>
                  </div>
                  <div>
                    <JSONTree data={this.state.response} theme={theme}/>
                  </div>
                </div>)
      }

    }
}

export default ApiExplorer;
