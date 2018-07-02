import { compose } from 'redux';
import { connect } from 'react-redux';

import ThemeHandler from './ThemeHandler';

export default compose(
  connect(state => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { profile } }) => ({ profile })),
)(ThemeHandler);
