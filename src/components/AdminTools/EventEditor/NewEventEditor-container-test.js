import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import NewEventEditor from './NewEventEditor';

export default compose(
  connect((state) => {
    const draftDate = moment(_.last(state.router.location.pathname.split('/')), 'YYYY-MM-DD');
    const draftID = `DRAFT-${draftDate.format('YYYY-MM-DD')}`;
    return ({
      participations: state.firebase.data.participations,
      categories: state.firebase.data.categories,
      settings: state.firebase.data.settings,
      location: state.router.location,
      draftContent: state.firebase.data.events[draftID],
      draftID,
      draftDate,
    });
  }),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(withRouter(NewEventEditor));
