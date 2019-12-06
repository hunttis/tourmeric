import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { withLocalize } from 'react-localize-redux';

import ExistingEventEditor from './ExistingEventEditor';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => {
    const idFromUrl = _.last(state.router.location.pathname.split('/'));
    const eventId = _.startsWith(idFromUrl, 'NEW') ? idFromUrl : `DRAFT-${idFromUrl}`;
    return ({
      participations: state.firebase.data.participations,
      categories: state.firebase.data.categories,
      settings: state.firebase.data.settings,
      location: state.router.location,
      event: state.firebase.data.events[eventId!],
      returnLocation: state.editor.returnLocation || '/events',
      eventId,
    });
  }),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withLocalize<any>(withRouter<any, any>(ExistingEventEditor))) as React.ComponentType<any>;
