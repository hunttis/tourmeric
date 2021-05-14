import { connect } from 'react-redux';
import { compose } from 'redux';

import CreditModal from './CreditModal';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    storecredit: state.firebase.data.storecredit,
    storecreditcategories: state.firebase.data.storecreditcategories,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(CreditModal) as React.ComponentType<any>;
