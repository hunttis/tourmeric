import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { UploadedCategoryLogosLoader } from './UploadedCategoryLogosLoader';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/uploadedCategoryLogos' },
  ]),
  connect((state: ReduxState) => ({
    uploadedCategoryLogos: state.firebase.data.uploadedCategoryLogos,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(UploadedCategoryLogosLoader) as React.ComponentType<any>;
