import { connect } from 'react-redux';
import { compose } from 'redux';
import { getActiveLanguage } from 'react-localize-redux';
import { firebaseConnect } from 'react-redux-firebase';
import ParticipationEditor from './ParticipationEditor';

export default compose(
  firebaseConnect([
    { path: '/users', queryParams: ['orderByChild=lastName'] },
  ]),
  connect(state => ({
    events: state.firebase.ordered.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    users: state.firebase.ordered.users,
    admin: state.admin,
    settings: state.firebase.data.settings,
    activeLanguage: getActiveLanguage(state.locale).code,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(ParticipationEditor);
