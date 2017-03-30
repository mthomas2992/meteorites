import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {

    constructor(props){
      super(props);
    };

    componentDidMount(){

    };


    render() {

      if (this.props.path == "Home"){
        return (<div id="home" className="container-fluid">
                  <div id="homeHeader" className="row">
                    <div id="header" className="col-md-12">
                      Meteoristics
                    </div>
                    <div id="docoSpacer" className="col-md-12"></div>
                  </div>
                  <div id = "homeInfo"> <a href="http://meteoristics.com/api/documentation?ver=v1"><h1> Meteoristics API Documentation </h1></a>
                      <br></br>

                  <h2> What is Meteoristics?</h2>
                  <p>Meteoristics is currently purely an API that allows for easy access to the Australian Bureau of Statistics data</p>
                  <p> In the future this will be our home page for our graphical interface, but for now we do not have anything to put here</p>
                  <h2> Our Team (Meteorites)</h2>
                  <p> Matthew Thomas </p>
                  <p> Mark Nerwich </p>
                  <p> Benjamin Phipps</p>
                  <p> <a href="https://www.instagram.com/tdonovic/">Tomas Donovic</a></p></div>
                </div>);
      } else {
        return (<div><a href="http://meteoristics.com/api/documentation?ver=v1"><h1> Meteoristics API Documentation </h1></a> <p>404</p></div>);
      }

    }
}

export default App;
