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
                    <JSONTree data={this.state.response}/>
                  </div>
                </div>)
      }

    }
}

export default ApiExplorer;
