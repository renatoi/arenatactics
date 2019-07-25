import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createStore, IModuleStore } from "redux-dynamic-modules-core";
import { getSagaExtension } from "redux-dynamic-modules-saga";
import { Provider } from "react-redux";
import Loadable from "react-loadable";
import ReactGA from "react-ga";

import styles from "./App.module.css";
import { Header } from "../Header/Header";
import { Home } from "../../routes/Home/Home";
import { Login } from "../../routes/Login/Login";
import { Register } from "../../routes/Register/Register";
import { TFTState } from "../../routes/TFT/types";
import { GlobalMousePos } from "../../globals";

ReactGA.initialize("UA-144208019-1", {
  debug: process.env.NODE_ENV === "development"
});

interface AppState {
  readonly TFT: TFTState;
}

class App extends Component {
  store: IModuleStore<AppState>;

  constructor(props: Readonly<{}>) {
    super(props);
    this.store = createStore<AppState>({
      extensions: [getSagaExtension()]
    });
  }

  handleMouseMove = (event: React.MouseEvent) => {
    GlobalMousePos.mouseX = event.clientX;
    GlobalMousePos.mouseY = event.clientY;
  };

  render() {
    return (
      <Provider store={this.store}>
        <div className={styles.app} onMouseMove={this.handleMouseMove}>
          <Router>
            <Route path="/" component={Header} />
            <Route path="/" exact component={Home} />
            <Route path="/teamfight-tactics" component={this.getTFTHome()} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
          </Router>
        </div>
      </Provider>
    );
  }

  getTFTHome() {
    return Loadable({
      loader: () => import("../../routes/TFT"),
      loading: () => <div />
    });
  }
}

export { App };
