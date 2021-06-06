import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";

import StoreInfoEditor from "./StoreInfoEditor";
import { ReduxState } from "../../../models/ReduxState";

export default compose(
  firebaseConnect([{ path: "/uploadedStoreinfoFiles" }]),
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
    uploadedStoreinfoFiles: state.firebase.data.uploadedStoreinfoFiles,
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile }))
)(StoreInfoEditor) as React.ComponentType<any>;
