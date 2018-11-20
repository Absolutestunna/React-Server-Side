import React from 'react';
import { Link, Switch, Route } from "react-router-dom";
import routes from "../routes";

class Layout extends React.Component {
  render(){
    return (
      <div>
        <div>Welcome to SSR2</div>
        <div>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
        </div>
          <Switch>
            { routes.map( route => <Route key={ route.path } { ...route } /> ) }
          </Switch>
      </div>
    )
  }
}

export default Layout;
