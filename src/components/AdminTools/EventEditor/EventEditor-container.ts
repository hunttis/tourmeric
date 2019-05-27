import { connect } from 'react-redux';
import { compose } from 'redux';

import EventEditor from './EventEditor';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    categories: state.firebase.data.categories,
    events: state.firebase.data.events,
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(EventEditor) as React.ComponentType<any>;
