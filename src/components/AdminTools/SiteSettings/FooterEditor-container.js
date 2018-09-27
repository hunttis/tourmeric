import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import FooterEditor from './FooterEditor';

export default compose(
  firebaseConnect([
    { path: '/settings' },
    { path: '/uploadedFooterItems' },
  ]),
  connect(state => ({
    settings: state.firebase.data.settings,
    uploadedFooterItems: state.firebase.data.uploadedFooterItems,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(FooterEditor);
