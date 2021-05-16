import { connect } from "react-redux";
import { compose } from "redux";
import { injectIntl } from "react-intl";
import { EventPlayerList } from "./EventPlayerList";
import { ReduxState } from "../../../models/ReduxState";

export default compose(
  connect((state: ReduxState) => ({
    events: state.firebase.data.events,
    eventsongoing: state.firebase.data.eventsongoing,
    participations: state.firebase.data.participations,
    settings: state.firebase.data.settings,
    languages: state.localize.languages,
    users: state.firebase.data.users,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile }))
)(injectIntl<any>(EventPlayerList)) as React.ComponentType<any>;
