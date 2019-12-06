import { connect } from 'react-redux';
import { compose } from 'redux';

import HighLights from './HighLights';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
    highlights: state.firebase.data.highlights,
  })),
  connect(({ firebase: { profile } }: ReduxState) => ({ profile })),
)(HighLights) as React.ComponentType<any>;
