import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import CategoryLogoUploader from './CategoryLogoUploader';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/settings' },
  ]),
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
    uploadedCategoryLogos: state.firebase.data.uploadedCategoryLogos,
  })),
)(CategoryLogoUploader) as React.ComponentType<any>;
