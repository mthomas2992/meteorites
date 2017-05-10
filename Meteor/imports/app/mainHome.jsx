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
                <br></br>
                <div onClick = {()=>{FlowRouter.go("/impact?title=Yasi&startDate=2011-01-09&endDate=2011-03-09")}}className = "col-md-10 col-md-offset-1" id = "yasiRoot">
                  <div className = "row">
                    <div id= "eventTitle" className = "col-md-6">
                      <div className = "row" id = "title">Cyclone Yasi</div>
                      <div id = "dates"> 2011-01 to 2011-03</div>
                    </div>
                    <div className= "col-md-6">
                      <img src ="images/yasi.png" id = "yasiImage"></img>
                    </div>
                  </div>
                </div>

              </div>)
    }
}

export default MainHome;
