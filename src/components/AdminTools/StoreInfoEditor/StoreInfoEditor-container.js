import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import StoreInfoEditor from './StoreInfoEditor';

export default compose(
  firebaseConnect([
    { path: '/uploadedStoreinfoFiles' },
  ]),
  connect(state => ({
    settings: state.firebase.data.settings,
    uploadedStoreinfoFiles: state.firebase.data.uploadedStoreinfoFiles,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(StoreInfoEditor);
