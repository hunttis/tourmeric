import { connect } from 'react-redux';
import { compose } from 'redux';

import ValidatedEditableField from './ValidatedEditableField';

export default compose(
  connect(state => ({
    categories: state.firebase.data.categories,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(ValidatedEditableField);
