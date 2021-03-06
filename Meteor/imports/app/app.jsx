import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import Briefs from '/imports/app/briefs.jsx';

import ReactGridLayout from 'react-grid-layout';
require ('/node_modules/react-grid-layout/css/styles.css');
require ('/node_modules/react-resizable/css/styles.css');

import Select from 'react-select';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import Impact from '/imports/app/impact.jsx';
import CustomImpact from '/imports/app/customImpact.jsx';
import About from '/imports/apiDocumentation/about.jsx';

import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

import MainHome from '/imports/app/mainHome.jsx';

class App extends React.Component {

    constructor(props){
      super(props);

      this.state = {
        timePeriodStart : "2015-09-09",
        timePeriodEnd : "2016-09-09",
        industry:"RetailTurnover",
        momentStart:null,
        momentEnd:null,
        panelCount:1,
        layout: [
         {i: 'briefs0', x: 0, y: 0, w: 6, h: 1, isResizable:false},
         {i: 'briefs1', x: 0, y: 1, w: 6, h: 1, isResizable:false},
         {i: 'briefs2', x: 0, y: 1, w: 6, h: 1, isResizable:false},
         {i: 'briefs3', x: 6, y: 1, w: 6, h: 1, isResizable:false},
        ]
      }

      this.onBreakpointChange = this.onBreakpointChange.bind(this);

      this.handleStartDateChange = this.handleStartDateChange.bind(this);
      this.handleEndDateChange = this.handleEndDateChange.bind(this);
      this.selectIndustryChange = this.selectIndustryChange.bind(this);

      this.addPanel= this.addPanel.bind(this);
      this.layoutChange = this.layoutChange.bind(this);
    };


    handleStartDateChange(date){
      this.setState({momentStart:date})
      this.setState({timePeriodStart:date.format('YYYY-MM-DD')});
    }

    handleEndDateChange(date){
      this.setState({momentEnd:date})
      this.setState({timePeriodEnd:date.format('YYYY-MM-DD')});
    }

    selectIndustryChange(option){
      this.setState({industry:option.value});
    }

    componentWillMount(){
      var startDateSplit = this.state.timePeriodStart.split('-');
      var endDateSplit = this.state.timePeriodEnd.split('-');
      var newStartMoment = new Moment(new Date(startDateSplit[0],startDateSplit[1]-1,startDateSplit[2]));
      var newEndMoment = new Moment(new Date(endDateSplit[0],endDateSplit[1]-1,endDateSplit[2]));
      this.setState({momentStart:newStartMoment,momentEnd:newEndMoment});
    };

    addPanel(){
      var currPanel = this.state.panelCount;
      if (currPanel<4){
        this.setState({panelCount:currPanel+1});
      }
    }

    removePanel(){
      var currPanel = this.state.panelCount;
      if (currPanel>1){
        this.setState({panelCount:currPanel-1});
      }
    }

    onBreakpointChange(breakpoint){
      // console.log(breakpoint)
    }

    layoutChange(layout){
      for (kl=0;kl<layout.length;kl++){
        layout[kl].w=6;
        // if (kl%2 != 0 && kl!=0) layout[kl].x=6;
      }
    }

    render() {
      var panels = new Array();
      var string="";
      for (i=0;i<this.state.panelCount;i++){
        string = "briefs"+i;
        panels.push(<div id = "briefsRoot" key={string}> <Briefs status = {this.state}/></div>);
      }
      // console.log(panels);
      var layouts = {lg:this.state.layout,md:this.state.layout};
      // console.log(layouts);

      if (this.props.path == "Explorer"){
        return (<div className="container-fluid">
                  <div className="navbar navbar-defualt">
                    <div id="navBar" className="row">
                      <div className="navbar-header">
                          <a id="navHeader" className="navbar-brand" href= "/">Meteoristics</a>
                      </div>
                      <ul className="nav navbar-nav navbar-right">
                        <li><a id="navHeader" href= "/">Home</a></li>
                        <li><a id="navHeader" href="/custom">Predictor</a></li>
                        <li><a id="navHeader" href="/explorer">Stats Explorer</a></li>
                        <li><a id="navHeader" href="/about">About</a></li>
                        <li><a id="navHeader" href="/api/documentation">API</a></li>
                        <li><a id="navPanelModify" onClick={()=>{this.addPanel()}}>Add Panel</a></li>
                        <li><a id="navPanelModify" onClick={()=>{this.removePanel()}}>Remove Panel</a></li>
                      </ul>
                    </div>
                    <div className="row">
                      <ResponsiveReactGridLayout
                        {...this.props}
                        className="layout"
                        layouts={layouts}
                        rowHeight={window.innerHeight-((window.innerHeight/100)*3)}
                        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                        cols={{lg: 12, md: 12, sm: 12, xs: 6, xxs: 6}}
                        measureBeforeMount={false}
                        onBreakpointChange={this.onBreakpointChange}
                        onLayoutChange={this.layoutChange}>
                        {panels}
                      </ResponsiveReactGridLayout>
                    </div>
                  </div>
                </div>);
      } else if (this.props.path == "impact") {
        return (<div className="container-fluid">
                  <div className="navbar navbar-defualt">
                    <div id="navBar" className="row">
                      <div className="navbar-header">
                          <a id="navHeader" className="navbar-brand" href= "/">Meteoristics</a>
                      </div>
                      <ul className="nav navbar-nav navbar-right">
                        <li><a id="navHeader" href= "/">Home</a></li>
                        <li><a id="navHeader" href="/custom">Predictor</a></li>
                        <li><a id="navHeader" href="/explorer">Stats Explorer</a></li>
                        <li><a id="navHeader" href="/about">About</a></li>
                        <li><a id="navHeader" href="/api/documentation">API</a></li>
                      </ul>
                    </div>
                    <Impact title = {this.props.queryParams.title} startDate={this.props.queryParams.startDate} endDate = {this.props.queryParams.endDate} region = {this.props.queryParams.region}/>
                  </div>
                </div>)
      } else if (this.props.path =="Home"){
        return(<div className="container-fluid">
                  <div className="navbar navbar-defualt">
                    <div id="navBar" className="row">
                      <div className="navbar-header">
                          <a id="navHeader" className="navbar-brand" href= "/">Meteoristics</a>
                      </div>
                      <ul className="nav navbar-nav navbar-right">
                        <li><a id="navHeader" href= "/">Home</a></li>
                        <li><a id="navHeader" href="/custom">Predictor</a></li>
                        <li><a id="navHeader" href="/explorer">Stats Explorer</a></li>
                        <li><a id="navHeader" href="/about">About</a></li>
                        <li><a id="navHeader" href="/api/documentation">API</a></li>
                      </ul>
                    </div>
                    <MainHome/>
                  </div>
                </div>)
      } else if (this.props.path == "Custom"){
        return (<div className="container-fluid">
                  <div className="navbar navbar-defualt">
                    <div id="navBar" className="row">
                      <div className="navbar-header">
                          <a id="navHeader" className="navbar-brand" href= "/">Meteoristics</a>
                      </div>
                      <ul className="nav navbar-nav navbar-right">
                        <li><a id="navHeader" href= "/">Home</a></li>
                        <li><a id="navHeader" href="/custom">Predictor</a></li>
                        <li><a id="navHeader" href="/explorer">Stats Explorer</a></li>
                        <li><a id="navHeader" href="/about">About</a></li>
                        <li><a id="navHeader" href="/api/documentation">API</a></li>
                      </ul>
                    </div>
                    <CustomImpact/>
                  </div>
                </div>)
      } else if (this.props.path == "About"){
        return (<div className="container-fluid">
                  <div className="navbar navbar-defualt">
                    <div id="navBar" className="row">
                      <div className="navbar-header">
                          <a id="navHeader" className="navbar-brand" href= "/">Meteoristics</a>
                      </div>
                      <ul className="nav navbar-nav navbar-right">
                        <li><a id="navHeader" href= "/">Home</a></li>
                        <li><a id="navHeader" href="/custom">Predictor</a></li>
                        <li><a id="navHeader" href="/explorer">Stats Explorer</a></li>
                        <li><a id="navHeader" href="/about">About</a></li>
                        <li><a id="navHeader" href="/api/documentation">API</a></li>
                      </ul>
                    </div>
                    <About/>
                  </div>
                </div>)
      } else {
        return (<div><h2>404</h2><p></p><a href="http://meteoristics.com/api/documentation"><h1> Meteoristics API Documentation </h1></a> </div>);
      }

    }
}

export default App;
