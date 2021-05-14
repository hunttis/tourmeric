import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { News } from './News';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/news', queryParams: ['orderByChild=date'] },
  ]),
  connect((state: ReduxState) => ({
    news: state.firebase.ordered.news,
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(News) as React.ComponentType<any>;
