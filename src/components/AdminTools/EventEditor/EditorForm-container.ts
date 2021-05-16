import { connect } from "react-redux";
import { compose } from "redux";

import { EditorForm } from "./EditorForm";
import { ReduxState } from "../../../models/ReduxState";

export default compose(
  connect((state: ReduxState) => ({
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    settings: state.firebase.data.settings,
    location: state.router.location,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile }))
) as React.ComponentType<any>;
