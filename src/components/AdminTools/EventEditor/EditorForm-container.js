import { connect } from 'react-redux';
import { compose } from 'redux';

import { EditorForm } from './EditorForm';

export default compose(
  connect(state => ({
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    settings: state.firebase.data.settings,
    location: state.router.location,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(EditorForm);
