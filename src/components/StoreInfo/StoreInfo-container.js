import { compose } from 'redux';
import { connect } from 'react-redux';

import StoreInfo from './StoreInfo';

export default compose(
  connect(state => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { profile } }) => ({ profile })),
)(StoreInfo);
