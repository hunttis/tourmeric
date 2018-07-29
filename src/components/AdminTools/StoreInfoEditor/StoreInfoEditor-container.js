import { connect } from 'react-redux';
import { compose } from 'redux';

import StoreInfoEditor from './StoreInfoEditor';

export default compose(
  connect(state => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(StoreInfoEditor);
