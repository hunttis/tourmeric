import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';

import ExistingEventEditor from './ExistingEventEditor';

export default compose(
  connect((state) => {
    const eventId = _.last(state.router.location.pathname.split('/'));
    return ({
      participations: state.firebase.data.participations,
      categories: state.firebase.data.categories,
      settings: state.firebase.data.settings,
      location: state.router.location,
      event: state.firebase.data.events[eventId],
      returnLocation: state.editor.returnLocation || '/events',
      eventId,
    });
  }),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(withRouter(ExistingEventEditor));
