import { connect } from 'react-redux';
import { compose } from 'redux';

import EditableField from './EditableField';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(EditableField) as React.ComponentType<any>;
