import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { setReturnLocation } from '../../actions/eventEditorActions';
import AdminEventList from './AdminEventList';

export default compose(
  connect(state => ({
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    events: state.firebase.data.events,
  }), dispatch => ({
    setReturnLocation: returnLocation => dispatch(setReturnLocation(returnLocation)),
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(withRouter(AdminEventList));
