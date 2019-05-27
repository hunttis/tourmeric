import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import NewsEditor from './NewsEditor';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/news', queryParams: ['orderByChild=createDate'] },
    { path: '/uploadedNewsImages' },
  ]),
  connect((state: ReduxState) => ({
    news: state.firebase.data.news,
    uploadedNewsImages: state.firebase.data.uploadedNewsImages,
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(NewsEditor) as React.ComponentType<any>;
