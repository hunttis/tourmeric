import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import News from './News';

export default compose(
  firebaseConnect([
    { path: '/news', queryParams: ['orderByChild=date'] },
  ]),
  connect(state => ({
    news: state.firebase.ordered.news,
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(News);
