import { connect } from 'react-redux';
import { compose } from 'redux';

import FooterBar from './FooterBar';

export default compose(
  connect(state => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(FooterBar);
