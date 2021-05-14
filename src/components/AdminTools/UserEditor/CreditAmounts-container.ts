import { connect } from 'react-redux';
import { compose } from 'redux';

import { CreditAmounts } from './CreditAmounts';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    storecredit: state.firebase.data.storecredit,
    storecreditcategories: state.firebase.data.storecreditcategories,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(CreditAmounts) as React.ComponentType<any>;
