import { connect } from 'react-redux';
import { compose } from 'redux';
import { ParticipateButton } from './ParticipateButton';

export default compose(
  connect(state => ({
    events: state.firebase.data.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(ParticipateButton);
