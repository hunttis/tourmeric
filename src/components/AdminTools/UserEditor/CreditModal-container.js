import { connect } from 'react-redux';
import { compose } from 'redux';

import CreditModal from './CreditModal';

export default compose(
  connect(state => ({
    storecredit: state.firebase.data.storecredit,
    storecreditcategories: state.firebase.data.storecreditcategories,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(CreditModal);
