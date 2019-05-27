import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import FooterEditor from './FooterEditor';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/settings' },
    { path: '/uploadedFooterItems' },
  ]),
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
    uploadedFooterItems: state.firebase.data.uploadedFooterItems,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(FooterEditor) as React.ComponentType<any>;
