import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from './Home';
import Login from './Login';

class Routers extends React.Component {
    render() {
        return (
            <div>
                <Router>
                    <Route exact path="/">
                        <Login />
                    </Route>
                    <Route path="/home">
                        <Home />
                    </Route>
                </Router>
            </div>
        )
    }
}

export default Routers;