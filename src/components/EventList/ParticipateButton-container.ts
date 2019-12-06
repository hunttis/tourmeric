import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { ParticipateButton } from './ParticipateButton';
import { ReduxState } from '~/models/ReduxState';
import { setReturnLocation } from '~/actions/eventEditorActions';

export default compose(
  connect((state: ReduxState) => ({
    events: state.firebase.data.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    settings: state.firebase.data.settings,
    userId: state.firebase.auth.uid,
    setReturnLocation: (returnLocation: string) => setReturnLocation(returnLocation),
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withRouter<any, any>(ParticipateButton)) as React.ComponentType<any>;
