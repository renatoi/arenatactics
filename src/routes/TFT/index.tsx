import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { DynamicModuleLoader } from "redux-dynamic-modules-react";
import { TFTHome } from "./containers/Home";
import { ConnectedBuilds } from "./containers/Builds";
import { TFTModule } from "./redux/module";
import { ConnectedItems } from "./containers/Items";
import { ConnectedChampions } from "./containers/Champions";
import { ConnectedCreateBuild } from "./containers/CreateBuild";

interface TFTProps extends RouteComponentProps {}

const TFT: React.FC<TFTProps> = ({ match }) => (
  <DynamicModuleLoader modules={[TFTModule]}>
    <Route
      path={`${match.url}/builds/:buildKey?`}
      component={ConnectedBuilds}
    />
    <Route
      path={`${match.url}/create-build`}
      component={ConnectedCreateBuild}
    />
    <Route
      path={`${match.url}/champions/:championKey?`}
      component={ConnectedChampions}
    />
    <Route path={`${match.url}/items/:itemKey?`} component={ConnectedItems} />
    <Route exact path={`${match.url}`} component={TFTHome} />
  </DynamicModuleLoader>
);

export default TFT;
