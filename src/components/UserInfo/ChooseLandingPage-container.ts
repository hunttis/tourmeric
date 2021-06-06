import { connect } from "react-redux";
import { compose } from "redux";
import ChooseLandingPage from "./ChooseLandingPage";
import { ReduxState } from "../../models/ReduxState";
import { injectIntl } from "react-intl";

export default compose(
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile }))
)(injectIntl<any>(ChooseLandingPage)) as React.ComponentType<any>;
