import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import FileHandler from './FileHandler';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/settings' },
    { path: '/uploadedFiles' },
  ]),
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
    uploadedFiles: state.firebase.data.uploadedFiles,
  })),
)(FileHandler) as React.ComponentType<any>;
