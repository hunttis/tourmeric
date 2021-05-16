import { connect } from "react-redux";
import { compose } from "redux";
import _ from "lodash";

import { SingleEvent } from "./SingleEvent";
import { ReduxState } from "../../../models/ReduxState";

export default compose(
  connect((state: ReduxState) => ({
    events: state.firebase.data.events,
    eventsongoing: state.firebase.data.eventsongoing,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    userid: state.firebase.auth.uid,
    settings: state.firebase.data.settings,
    languages: state.localize.languages,
    isAdmin: _.get(state, "firebase.profile.role", "user") === "admin",
    users: state.firebase.data.users,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile }))
)(SingleEvent) as React.ComponentType<any>;
