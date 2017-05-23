import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

class MainHome extends React.Component {

    constructor(props){
      super(props);

    };

    componentDidMount(){

    };

    render() {
      return (<div className = "row">
                <div onClick = {()=>{FlowRouter.go("/impact?title=Yasi&startDate=2011-01-09&endDate=2011-03-09")}}className = "col-md-7" id = "yasiRoot">
                  Yasi clyclone
                </div>
                <div onClick = {()=>{FlowRouter.go('/impact?title=CycloneLarry&startDate=2009-01-09&endDate=2009-03-09')}} className = "col-md-5" id= "rightTop">
                  Black Saturday bushfires
                </div>
                <div onClick = {()=>{FlowRouter.go('/impact?title=CycloneLarry&startDate=2006-02-09&endDate=2006-04-09')}} className = "col-md-5" id = "rightBottom">
                  Cyclone larry
                </div>

              </div>)
    }
}

export default MainHome;
