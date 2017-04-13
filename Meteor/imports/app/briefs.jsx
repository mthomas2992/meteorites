import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

class Briefs extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        currentStates: this.props.status.selectedStates,
        currentIndustry: this.props.status.industry,
        currentTimePeriodStart: this.props.status.timePeriodStart,
        currentTimePeriodEnd: this.props.status.timePeriodEnd,
        currentStatesData: null,
        loading: true
      }

      this.loadData = this.loadData.bind(this);
    };

    componentWillReceiveProps(nextProps){
      this.loadData(nextProps);
    }

    componentWillMount(){
      this.loadData(this.props);
    };

    loadData(newProps){
      console.log("called Loading" );
      this.setState({loading:true});
      console.log(newProps);
      this.setState({currentStates:newProps.status.selectedStates,currentIndustry:newProps.status.industry,currentTimePeriodStart:newProps.status.timePeriodStart,currentTimePeriodEnd:newProps.status.timePeriodEnd})
      var newCurrStateData = {};
      var self =this;
      for (i=0;i<newProps.status.selectedStates.length;i++){
        Meteor.call('getAllTotalsOverTimeRetail',newProps.status.selectedStates[i],newProps.status.timePeriodStart,newProps.status.timePeriodEnd, function (err,res){
          newCurrStateData[res.state] = res.data;
          self.setState({currentStatesData:newCurrStateData});
          self.setState({loading:false}); //only good when there is just one state
        });
      }

    }

    componentDidMount(){

    };

    render() {
      if (this.state.loading){
        return (<div>Loading....</div>);
      } else {
        if (this.state.currentStates.length <=1){
          //create table from given data
          console.log(this.state.currentStatesData);
          return(<div className= "col-md-12">
                  <div id = "singularTitle" className="row"> State data for {this.state.currentStates[0]}</div>
                  <div id= "singularGraphSection" className="row"> Graphs will go here </div>
                  <div id= "singularTableData" className="row">Data tables will go here</div>
                  
                </div>);
        } else {
          return (<div> Error </div>);
        }
      }
    }
}

export default Briefs;
