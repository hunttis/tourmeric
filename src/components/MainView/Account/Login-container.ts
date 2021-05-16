import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";
import Login from "./Login";
import { ReduxState } from "../../../models/ReduxState";
import { setReturnLocation } from "../../../actions/eventEditorActions";

export default compose(
  connect((state: ReduxState) => ({
    returnLocation: state.editor.returnLocation || "/today",
    setReturnLocation: (returnLocation: string) =>
      setReturnLocation(returnLocation),
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile }))
)(withRouter<any, any>(injectIntl(Login))) as React.ComponentType<any>;
