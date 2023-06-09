import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { setReturnLocation } from '../../actions/eventEditorActions';
import { AdminEventList } from './AdminEventList';
import { ReduxState } from '~/models/ReduxState';

export const AdminEventListContainer = compose(
  connect((state: ReduxState) => ({
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    events: state.firebase.data.events,
    setReturnLocation: (returnLocation: string) => setReturnLocation(returnLocation),
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withRouter<any, any>(AdminEventList)) as React.ComponentType<any>;
