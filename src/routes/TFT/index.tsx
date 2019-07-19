import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { DynamicModuleLoader } from "redux-dynamic-modules-react";
import { Home } from "./components/Home";
import { Builds } from "./components/Builds";
import { ConnectedChampions } from "./components/Champions";
import { ConnectedItems } from "./components/Items";
import { TFTModule } from "./redux/module";

interface TFTProps extends RouteComponentProps {}

const TFT: React.FC<TFTProps> = ({ match }) => (
  <DynamicModuleLoader modules={[TFTModule]}>
    <Route path={`${match.url}/builds`} component={Builds} />
    <Route
      path={`${match.url}/champions/:championKey?`}
      component={ConnectedChampions}
    />
    <Route path={`${match.url}/items/:itemKey?`} component={ConnectedItems} />
    <Route exact path={`${match.url}`} component={Home} />
  </DynamicModuleLoader>
);

export default TFT;