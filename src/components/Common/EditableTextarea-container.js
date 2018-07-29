import { connect } from 'react-redux';
import { compose } from 'redux';

import EditableField from './EditableField';

export default compose(
  connect(state => ({
    categories: state.firebase.data.categories,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(EditableField);
