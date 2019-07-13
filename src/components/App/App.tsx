import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import { asyncComponent } from "../AsyncComponent/AsyncComponent";
import { Header } from "../Header/Header";

const AsyncHome = asyncComponent(() => import("../../routes/Home"));

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Header />
        <Route path="/" exact component={AsyncHome} />
      </Router>
    </div>
  );
};

export { App };
