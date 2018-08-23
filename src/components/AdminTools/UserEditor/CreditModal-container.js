import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import CreditModal from './CreditModal';

export default compose(
  firebaseConnect([
    { path: '/storecredit' },
  ]),
  connect(state => ({
    storecredit: state.firebase.data.storecredit,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(CreditModal);
