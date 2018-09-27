import { connect } from 'react-redux';
import { compose } from 'redux';

import EditableField from './EditableField';

export default compose(
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(EditableField);
