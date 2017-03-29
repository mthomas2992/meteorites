import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

class MainBody extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        pageContents:null
      }
    };

    componentWillReceiveProps(nextProps){
      var self = this;
      Meteor.call('getDocumentationPageContents',nextProps.version,nextProps.endpoint, function (err,res){
        self.setState({pageContents:{__html:res}});
      })
    };


    render() {
      if (this.state.pageContents){
        return (<div id="mainBodyText" dangerouslySetInnerHTML={this.state.pageContents}></div>);
      } else {
        return (<div> Loading....
                </div>);
      }


    }
}

export default MainBody;
