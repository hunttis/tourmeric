import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";

import OpeningHoursExceptionEditor from "./OpeningHoursExceptionEditor";
import { ReduxState } from "../../../models/ReduxState";
import { injectIntl } from "react-intl";

export default compose(
  firebaseConnect([{ path: "/openinghoursexceptions" }]),
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile }))
)(injectIntl<any>(OpeningHoursExceptionEditor)) as React.ComponentType<any>;
