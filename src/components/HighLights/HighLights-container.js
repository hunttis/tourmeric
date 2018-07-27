import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import HighLights from './HighLights';

export default compose(
  firebaseConnect([
    { path: '/highlights', queryParams: ['orderByChild=date'] },
  ]),
  connect(state => ({
    settings: state.firebase.data.settings,
    highlights: state.firebase.data.highlights,
  })),
  connect(({ firebase: { profile } }) => ({ profile })),
)(HighLights);
