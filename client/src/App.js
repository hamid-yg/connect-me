import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import "antd/dist/antd.css";
import "font-awesome/css/font-awesome.min.css";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/video" component={Home} />
        <Route exact path="/" component={Landing} />
      </Switch>
    </Router>
  );
};

export default App;
