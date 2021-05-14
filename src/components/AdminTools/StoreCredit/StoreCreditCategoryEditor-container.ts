import { connect } from 'react-redux';
import { compose } from 'redux';

import { StoreCreditCategoryEditor } from './StoreCreditCategoryEditor';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    storecreditcategories: state.firebase.data.storecreditcategories,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(StoreCreditCategoryEditor) as React.ComponentType<any>;
