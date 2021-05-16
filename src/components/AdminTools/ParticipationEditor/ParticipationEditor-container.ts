import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { firebaseConnect } from 'react-redux-firebase';
import ParticipationEditor from './ParticipationEditor';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/users', queryParams: ['orderByChild=lastName'] },
  ]),
  connect((state: ReduxState) => ({
    events: state.firebase.ordered.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    users: state.firebase.ordered.users,
    admin: state.admin,
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(injectIntl<any>(ParticipationEditor)) as React.ComponentType<any>;
