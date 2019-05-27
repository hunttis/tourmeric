import { connect } from 'react-redux';
import { compose } from 'redux';
import { ParticipateButton } from './ParticipateButton';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    events: state.firebase.data.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    settings: state.firebase.data.settings,
    userId: state.firebase.auth.uid,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(ParticipateButton) as React.ComponentType<any>;
