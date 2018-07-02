import { connect } from 'react-redux';
import { compose } from 'redux';

import EditableEvent from './EditableEvent';

export default compose(
  connect(state => ({
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(EditableEvent);
