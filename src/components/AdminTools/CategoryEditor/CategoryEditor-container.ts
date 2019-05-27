import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import CategoryEditor from './CategoryEditor';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/settings' },
  ]),
  connect((state: ReduxState) => ({
    events: state.firebase.data.events,
    categories: state.firebase.data.categories,
    uploadedCategoryLogos: state.firebase.data.uploadedCategoryLogos,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(CategoryEditor);
