import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import CategoryLogoUploader from './CategoryLogoUploader';

export default compose(
  firebaseConnect([
    { path: '/settings' },
    { path: '/uploadedCategoryLogos' },
  ]),
  connect(state => ({
    settings: state.firebase.data.settings,
    uploadedCategoryLogos: state.firebase.data.uploadedCategoryLogos,
  })),
)(CategoryLogoUploader);
