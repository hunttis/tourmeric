import { connect } from 'react-redux';
import { compose } from 'redux';

import EditableTextarea from './EditableTextarea';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    categories: state.firebase.data.categories,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(EditableTextarea) as React.ComponentType<any>;
