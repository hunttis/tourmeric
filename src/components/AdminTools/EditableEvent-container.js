import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { setReturnLocation } from '../../actions/eventEditorActions';
import EditableEvent from './EditableEvent';

export default compose(
  connect(state => ({
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    settings: state.firebase.data.settings,
  }), dispatch => ({
    setReturnLocation: returnLocation => dispatch(setReturnLocation(returnLocation)),
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(withRouter(EditableEvent));
