import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import CategoryEditor from './CategoryEditor';

export default compose(
  firebaseConnect([
    { path: '/settings' },
    { path: '/uploadedCategoryLogos' },
  ]),
  connect(state => ({
    events: state.firebase.data.events,
    categories: state.firebase.data.categories,
    uploadedCategoryLogos: state.firebase.data.uploadedCategoryLogos,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(CategoryEditor);
