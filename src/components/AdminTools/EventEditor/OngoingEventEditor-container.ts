import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';

import ExistingEventEditor from './ExistingEventEditor';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => {
    const eventId = _.last(state.router.location.pathname.split('/'));
    return ({
      participations: state.firebase.data.participations,
      categories: state.firebase.data.categories,
      settings: state.firebase.data.settings,
      location: state.router.location,
      event: state.firebase.data.eventsongoing[eventId!],
      returnLocation: state.editor.returnLocation || '/events',
      eventId,
      isOngoingEvent: true,
    });
  }),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withRouter<any>(ExistingEventEditor)) as React.ComponentType<any>;
