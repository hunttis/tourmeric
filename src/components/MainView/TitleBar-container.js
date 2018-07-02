import { compose } from 'redux';
import { connect } from 'react-redux';

import TitleBar from './TitleBar';

export default compose(
  connect(state => ({
    settings: state.firebase.data.settings,
    languages: state.locale.languages,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(TitleBar);
