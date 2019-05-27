import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import HighlightEditor from './HighlightEditor';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/highlights' },
    { path: '/uploadedHighlightBanners' },
  ]),
  connect((state: ReduxState) => ({
    highlights: state.firebase.data.highlights,
    uploadedHighlightBanners: state.firebase.data.uploadedHighlightBanners,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(HighlightEditor) as React.ComponentType<any>;
