import { connect } from 'react-redux';
import { compose } from 'redux';

import EventEditor from './EventEditor';

export default compose(
  connect(state => ({
    categories: state.firebase.data.categories,
    events: state.firebase.data.events,
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(EventEditor);
