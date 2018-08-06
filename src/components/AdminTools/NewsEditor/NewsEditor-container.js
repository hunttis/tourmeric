import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import NewsEditor from './NewsEditor';

export default compose(
  firebaseConnect([
    { path: '/news' },
    { path: '/uploadedNewsImages' },
  ]),
  connect(state => ({
    news: state.firebase.data.news,
    uploadedNewsImages: state.firebase.data.uploadedNewsImages,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(NewsEditor);
