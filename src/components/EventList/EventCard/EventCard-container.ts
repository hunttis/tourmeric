import _ from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { setReturnLocation } from '../../../actions/eventEditorActions';
import EventCard from './EventCard';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    events: state.firebase.data.events,
    eventsongoing: state.firebase.data.eventsongoing,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    userId: state.firebase.auth.uid,
    settings: state.firebase.data.settings,
    languages: state.localize.languages,
    isAdmin: _.get(state, 'firebase.profile.role', 'user') === 'admin',
    setReturnLocation: (returnLocation: string) => setReturnLocation(returnLocation),
  })),
  connect(({ firebase: { profile } }: ReduxState) => ({ profile })),
)(withRouter<any, any>(EventCard)) as React.ComponentType<any>;
