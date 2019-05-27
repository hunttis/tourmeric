import { connect } from 'react-redux';
import { compose } from 'redux';

import FooterBar from './FooterBar';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(FooterBar) as React.ComponentType<any>;
