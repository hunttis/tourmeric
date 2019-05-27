import { connect } from 'react-redux';
import { compose } from 'redux';

import FeatureEditor from './FeatureEditor';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(FeatureEditor) as React.ComponentType<any>;
