import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import HighlightEditor from './HighlightEditor';

export default compose(
  firebaseConnect([
    { path: '/highlights' },
  ]),
  connect(state => ({
    highlights: state.firebase.data.highlights,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(HighlightEditor);
