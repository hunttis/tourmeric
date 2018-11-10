import { connect } from 'react-redux';
import { compose } from 'redux';

import { StoreCreditCategoryEditor } from './StoreCreditCategoryEditor';

export default compose(
  connect(state => ({
    storecreditcategories: state.firebase.data.storecreditcategories,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(StoreCreditCategoryEditor);
