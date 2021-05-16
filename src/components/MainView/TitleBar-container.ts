import { compose } from "redux";
import { connect } from "react-redux";

import TitleBar from "./TitleBar";
import { ReduxState } from "../../models/ReduxState";

export default compose(
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile }))
)(TitleBar) as React.ComponentType<any>;
