import { connect } from 'react-redux';
import { compose } from 'redux';

import { withRouter } from 'react-router';
import { EventParticipation } from './EventParticipation';
import { ReduxState } from '../../models/ReduxState';

export default compose(
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
  connect((state: ReduxState) => ({
    events: state.firebase.data.events,
    settings: state.firebase.data.settings,
  })),
)(withRouter<any, any>(EventParticipation)) as React.ComponentType<any>;
