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
        return (<div><h1>Home page for the meteorites</h1>
                <h2> The team </h2>
                <p> Matthew Thomas </p>
                <p> Mark Nerwich </p>
                <p> Benjamin Phipps</p>
                <p> Tomas Donovic</p>
                </div>);
      } else {
        return (<p>404</p>);
      }

    }
}

export default App;
