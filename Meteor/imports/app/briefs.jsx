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
        currentStatesData: null
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
      this.setState({currentStates:newProps.status.selectedStates,currentIndustry:newProps.status.industry,currentTimePeriodStart:newProps.status.timePeriodStart,currentTimePeriodEnd:newProps.status.timePeriodEnd})
      var newCurrStateData = {};
      var self =this;
      for (i=0;i<this.state.currentStates.length;i++){
        Meteor.call('getAllTotalsOverTimeRetail',this.state.currentStates[i],this.state.currentTimePeriodStart,this.state.currentTimePeriodEnd, function (err,res){
          newCurrStateData[res.state] = res.data;
          self.setState({currentStatesData:newCurrStateData});
        });
      }
    }

    componentDidMount(){

    };

    render() {
      if (this.state.currentStates.length <=1){
        console.log(this.state.currentStatesData);
        return(<div> State data for {this.state.currentStates[0]}</div>);
      } else {
        return (<div> Error </div>);
      }
    }
}

export default Briefs;
