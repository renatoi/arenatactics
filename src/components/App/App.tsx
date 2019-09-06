import createSagaMiddleware from "@redux-saga/core";
import React, { Component } from "react";
import ReactGA from "react-ga";
import Helmet from "react-helmet";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { applyMiddleware, compose, createStore, Store } from "redux";
import { GlobalMousePos } from "../../globals";
import { gameDataFetch } from "../../redux/actions";
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
import { AppState, Locale } from "../../types";
import { getLocale } from "../../utils";
import { Header } from "../Header/Header";
import styles from "./App.module.css";

ReactGA.initialize("UA-144208019-1", {
  debug: process.env.NODE_ENV === "development"
});

const basePath = "/:locale(en-us|pt-br)?";

class App extends Component {
  store: Store<AppState>;
  locale: Locale;

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
    this.locale = getLocale();
    this.store.dispatch(gameDataFetch(this.locale));
  }

  handleMouseMove = (event: React.MouseEvent) => {
    GlobalMousePos.mouseX = event.clientX;
    GlobalMousePos.mouseY = event.clientY;
  };

  fetchData = () => {
    const locale = getLocale();
    if (this.locale !== locale) {
      this.store.dispatch(gameDataFetch(locale));
      this.locale = locale;
    }
    return null;
  };

  render() {
    return (
      <Provider store={this.store}>
        <Helmet>
          <html
            lang={getLocale()
              .split("-")
              .map((str, idx) => (idx === 1 ? str.toUpperCase() : str))
              .join("-")}
          />
        </Helmet>
        <div className={styles.app} onMouseMove={this.handleMouseMove}>
          <Router>
            <Route path="/" component={this.fetchData} />
            <Route path={basePath} component={Header} />
            <Route exact path={basePath} component={Home} />
            <Route path={`${basePath}/comps/:compKey?`} component={Builds} />
            <Route path={`${basePath}/create-build`} component={CreateBuild} />
            <Route
              path={`${basePath}/champions/:championKey?`}
              component={Champions}
            />
            <Route path={`${basePath}/items/:itemKey?`} component={Items} />
            <Route path={`${basePath}/login`} exact component={Login} />
            <Route path={`${basePath}/register`} exact component={Register} />
          </Router>
        </div>
      </Provider>
    );
  }
}

export { App };
