import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

import Briefs from '/imports/app/briefs.jsx';
import AusMap from '/imports/app/ausMap.jsx';


import ReactGridLayout from 'react-grid-layout';
require ('/node_modules/react-grid-layout/css/styles.css');
require ('/node_modules/react-resizable/css/styles.css');

import Select from 'react-select';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import Impact from '/imports/app/impact.jsx';

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
        return (<div id="home" className="container-fluid">
                  <div id="homeTopBar" className="row">
                    <div id="frontHeader" className="col-md-4">
                      Meteoristics
                    </div>
                    <div id = "prompt" className= "col-md-1"> Select industry </div>
                    <div id = "stateSelectorID" className = "col-md-1">
                      <Select
                      name= "industry-selector"
                      value= {this.state.industry}
                      options = {[{value:"RetailTurnover",label:"Retail Turnover"},{value:"MerchandiseExports",label:"Merchandise Exports"}]}
                      clearable = {false}
                      onChange = {this.selectIndustryChange.bind(this)}
                      />
                    </div>
                    <div className="col-md-2">
                      Start Date:
                      <DatePicker
                        dateFormat="YYYY-MM-DD"
                        selected = {this.state.momentStart}
                        onChange = {this.handleStartDateChange}
                        />
                    </div>
                    <div className="col-md-2">
                      End Date:
                      <DatePicker
                        dateFormat="YYYY-MM-DD"
                        selected = {this.state.momentEnd}
                        onChange = {this.handleEndDateChange}
                        />
                    </div>
                    <div onClick={()=>{this.addPanel()}} id="addSection" className="col-md-1">
                      Add Panel
                    </div>
                    <div onClick={()=>{this.removePanel()}}id="removeSection" className="col-md-1">
                      Remove Panel
                    </div>
                  </div>
                  <div id="Menu" className="row">
                    <a href="http://meteoristics.com/api/documentation">API</a>
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

                </div>);
      } else if (this.props.path == "impact") {
        return (<div className="container-fluid">
                  <div id="homeTopBar" className="row">
                      <div id="frontHeader" className="col-md-4">
                        Meteoristics
                      </div>
                  </div>
                  <div id="Menu" className="row">
                    <a href="http://meteoristics.com/api/documentation">API</a>
                  </div>
                  <Impact title = {this.props.queryParams.title} startDate={this.props.queryParams.startDate} endDate = {this.props.queryParams.endDate}/>
                </div>)
      } else if (this.props.path =="Home"){
        return(<div className="container-fluid">
                  <div id="homeTopBar" className="row">
                      <div id="frontHeader" className="col-md-4">
                        Meteoristics
                      </div>
                  </div>
                  <div id="Menu" className="row">
                    <a href="http://meteoristics.com/api/documentation">API</a>
                  </div>
                  <MainHome/>
                </div>)
      } else {
        return (<div><a href="http://meteoristics.com/api/documentation?ver=v1"><h1> Meteoristics API Documentation </h1></a> <p>404</p></div>);
      }

    }
}

export default App;
