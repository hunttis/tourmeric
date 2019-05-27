import { connect } from 'react-redux';
import { compose } from 'redux';

import EditableVerticalField from './EditableVerticalField';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    categories: state.firebase.data.categories,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(EditableVerticalField) as React.ComponentType<any>;
