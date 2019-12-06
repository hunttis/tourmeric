import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { HighLightsLoader } from './HighLightsLoader';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/highlights', queryParams: ['orderByChild=date'] },
  ]),
  connect((state: ReduxState) => ({
    highlights: state.firebase.data.highlights,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(HighLightsLoader) as React.ComponentType<any>;
