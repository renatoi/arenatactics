import createSagaMiddleware from "@redux-saga/core";
import React, { Component } from "react";
import ReactGA from "react-ga";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { applyMiddleware, compose, createStore, Store } from "redux";
import { GlobalMousePos } from "../../globals";
import { gameDataFetch, localizedStringsFetch } from "../../redux/actions";
import { emptyState } from "../../redux/emptyState";
import { reducers } from "../../redux/reducers";
import rootSaga from "../../redux/sagas";
import Builds from "../../routes/Builds";
import Champions from "../../routes/Champions";
import CreateBuild from "../../routes/CreateBuild";
import Home from "../../routes/Home";
import Items from "../../routes/Items";
import Login from "../../routes/Login";
import Register from "../../routes/Register";
import { AppState } from "../../types";
import { getLocale } from "../../utils";
import { Header } from "../Header/Header";
import styles from "./App.module.css";

ReactGA.initialize("UA-144208019-1", {
  debug: process.env.NODE_ENV === "development"
});

class App extends Component {
  store: Store<AppState>;

  constructor(props: Readonly<{}>) {
    super(props);
    const sagaMiddleware = createSagaMiddleware();
    const composeEnhancers =
      (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    this.store = createStore(
      reducers,
      emptyState,
      composeEnhancers(applyMiddleware(sagaMiddleware))
    );
    sagaMiddleware.run(rootSaga);
    const locale = getLocale();
    this.store.dispatch(localizedStringsFetch(locale));
    this.store.dispatch(gameDataFetch(locale));
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
            <Route exact path={"/"} component={Home} />
            <Route path="/builds/:buildKey?" component={Builds} />
            <Route path="/create-build" component={CreateBuild} />
            <Route path="/champions/:championKey?" component={Champions} />
            <Route path="/items/:itemKey?" component={Items} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
          </Router>
        </div>
      </Provider>
    );
  }
}

export { App };
