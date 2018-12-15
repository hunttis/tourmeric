import { connect } from 'react-redux';
import { compose } from 'redux';

import { PageTitles } from './PageTitles';

export default compose(
  connect(state => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(PageTitles);
