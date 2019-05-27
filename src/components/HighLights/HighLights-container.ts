import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import HighLights from './HighLights';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/highlights', queryParams: ['orderByChild=date'] },
  ]),
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
    highlights: state.firebase.data.highlights,
  })),
  connect(({ firebase: { profile } }: ReduxState) => ({ profile })),
)(HighLights) as React.ComponentType<any>;
