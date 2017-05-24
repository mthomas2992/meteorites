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
                <div onClick = {()=>{FlowRouter.go("/impact?title=Cyclone%20Yasi&startDate=2011-01-09&endDate=2011-03-09&region=QLD")}}className = "col-md-7" id = "yasiRoot">
                <img src='/images/yasi.png'/>
                </div>
                <div onClick = {()=>{FlowRouter.go('/impact?title=Black%20Saturday&startDate=2006-02-09&endDate=2006-04-09&region=AUS')}} className = "col-md-5" id= "rightTop">
                  <img src='/images/fire.png'/>
                </div>
                <div onClick = {()=>{FlowRouter.go('/impact?title=Cyclone%20Larry&startDate=2009-01-09&endDate=2009-03-09&region=VIC')}} className = "col-md-5" id = "rightBottom">
                  <img src='/images/cyclone.png'/>
                </div>

              </div>)
    }
}

export default MainHome;
