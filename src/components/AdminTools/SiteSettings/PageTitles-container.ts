import { connect } from 'react-redux';
import { compose } from 'redux';

import { PageTitles } from './PageTitles';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(PageTitles) as React.ComponentType<any>;
