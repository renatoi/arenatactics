import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import styles from "./App.module.css";
import { asyncComponent } from "../AsyncComponent/AsyncComponent";
import { Header } from "../Header/Header";
import { Home } from "../../routes/Home/Home";
import { Login } from "../../routes/Login/Login";
import { Register } from "../../routes/Register/Register";

const AsyncTFTHome = asyncComponent(() => import("../../routes/TFTHome"));
const AsyncTFTBuilds = asyncComponent(() => import("../../routes/TFTBuilds"));
const AsyncTFTChampions = asyncComponent(() =>
  import("../../routes/TFTChampions")
);
const AsyncTFTItems = asyncComponent(() => import("../../routes/TFTItems"));

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <Router>
        <Route path="/" component={Header} />
        <div className="PageContainer PageContent">
          <Route path="/" exact component={Home} />
          <Route exact path="/teamfight-tactics" component={AsyncTFTHome} />
          <Route path="/teamfight-tactics/builds" component={AsyncTFTBuilds} />
          <Route
            path="/teamfight-tactics/champions"
            component={AsyncTFTChampions}
          />
          <Route path="/teamfight-tactics/items" component={AsyncTFTItems} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
        </div>
      </Router>
    </div>
  );
};

export { App };
