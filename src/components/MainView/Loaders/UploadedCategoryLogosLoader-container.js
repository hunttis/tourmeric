import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { UploadedCategoryLogosLoader } from './UploadedCategoryLogosLoader';

export default compose(
  firebaseConnect([
    { path: '/uploadedCategoryLogos' },
  ]),
  connect(state => ({
    uploadedCategoryLogos: state.firebase.data.uploadedCategoryLogos,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(UploadedCategoryLogosLoader);
