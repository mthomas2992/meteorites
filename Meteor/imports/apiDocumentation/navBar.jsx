import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

class NavBar extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        currentVersionIndex:null
      }
    };

    componentWillReceiveProps(nextProps){
      var self = this;
      Meteor.call('getApiVersionIndex', nextProps.version,function(err,res){
        self.setState({currentVersionIndex:res});
      });
    };

    componentWillMount(){
      var self = this;
      Meteor.call('getApiVersionIndex', this.props.version,function(err,res){
        self.setState({currentVersionIndex:res});
      });
    }

    render() {

      if (this.state.currentVersionIndex){
        var links = new Array();
        for (i=0;i<this.state.currentVersionIndex.paths.length;i++){
          links.push(<a href={"/api/documentation?ver="+this.state.currentVersionIndex.ver+"&endpoint="+this.state.currentVersionIndex.paths[i]}><div className="col-md-12 col-md-offset-1">{this.state.currentVersionIndex.paths[i]}</div></a>)
        }
        return (<div>
                  <a href={"/api/documentation?ver="+this.state.currentVersionIndex.ver}> <div> Version home/changelog </div></a>
                  <a href={"/api/documentation?ver="+this.state.currentVersionIndex.ver+"&endpoint=explorer"}><div> API Demo</div></a>
                  <div id = 'subTitle'>Endpoints:{links}</div>
                </div>)
      } else {
        return (<div>Invalid Version selected
                </div>);
      }
    }
}

export default NavBar;
