
import React from 'react';

import {

  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

// import Repos from './Pages/Repos';
//
// import Repo from './Pages/Repo';
//
// import Page404 from './Pages/Page404';

import Example from '@app/Example';

import './App.scss'

export default function App() {
  return (
    <div>
      App...
      <Example />
    </div>
    // <Switch>
    //   <Route
    //     path="/"
    //     exact={true}
    //     component={() => <Redirect to="/repos/1" />}
    //   />
    //   <Route
    //     path="/repos/:page(\d+)?"
    //     exact={true}
    //     component={Repos}
    //   />
    //   <Route
    //     path="/repo/:name"
    //     exact={true}
    //     component={Repo}
    //   />
    //   <Route
    //     component={Page404}
    //   />
    // </Switch>
  );
}


