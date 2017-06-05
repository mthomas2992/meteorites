import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';



class About extends React.Component {

    constructor(props){
      super(props);
      this.state = {}

    };


    render() {

          return(
            <div>
              <div id = "aboutPageMainHeading">
                What is Meteoristics?
              </div>

              <div id = "aboutPageMainBody" className ="col-md-10">
                Meteoristics is a powerful web app for analysing the impact
                of a severe news event, such as a cyclone, on domestic retail trade
                also merchandise exports. To get started simply go the front page and
                click on a news event which you want to investigate. This will take
                you to an impact page which displays an interactive graph on the
                statistical impact of the event as well as key statistics and specialised,
                industry specific graphs. The full impact of the event can be easily
                examined as cyclic peaks and troughs are automatically accounted
                for and the data is graphed in relation to the last cycle so
                the impact is clearer to see.
                Meteoristics then uses this
                data to intelligently calculate how swings in certain areas
                of retail and merchandise statistics can affect other areas
                in addition to how they will affect related companies listed
                in the Australian Stock Market. This predictive technology is
                visible on the "Predictor" page which is present on the navigation
                bar at the top of the screen. As part of the predictor, Meteoristics
                also provides a summation of the sentiment of news
                articles which are written about the affected companies. Finally
                Meteoristics presents this information graphically, through
                the use of an intuitive and highly customisable interface.
              </div>
            </div>);
    }
}

export default About;
