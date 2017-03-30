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
        return (<div id="home"><h1 id="header">Home page for the meteorites</h1>
                <h2> What are we even doing here????</h2>
                <p> After a rather successful attempt at SENG2021, we decided we had to try it <a>href="https://www.youtube.com/watch?v=FGBhQbmPwH8">one more time</a>. As a result, we are here, writing more really well written and honestly, better than ever solutions to arbitrary problems that we are given. Given this is the last SENG workshop, we want to make it count and do even better than last time. Thats why we bought a URL this time ( ͡° ͜ʖ ͡°)</p>
                <br></br>
                <h2> But who are we?</h2>
                <p> Matthew Thomas </p>
                <p> Mark Nerwich </p>
                <p> Benjamin Phipps</p>
                <p> <a href="https://www.instagram.com/tdonovic/">Tomas Donovic</a></p>
                <h2> But you say, this stuff isn't even important, give us the project!!</h2>
                <p> To this we would reply, you are probably right, you can find our <a href="http://meteoristics.com/api/documentation?ver=v1">API docs here</a>. We could point you to how to make an API call from this page, but you are honestly better off just checking out the extremely well written and all encompassing support docs. If you get stuck, be sure to tell us <a href="mailto:tomasdonovic@gmail.com">here</a></p>
                </div>);
      } else {
        return (<p>404</p>);
      }

    }
}

export default App;
