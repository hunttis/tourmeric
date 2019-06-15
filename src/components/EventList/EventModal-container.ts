import { connect } from 'react-redux';
import { compose } from 'redux';
import { EventModal } from './EventModal';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    events: state.firebase.data.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { profile } }: ReduxState) => ({ profile })),
)(EventModal) as React.ComponentType<any>;
