import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import EventModal from './EventModal';

export default compose(
  firebaseConnect([
    { path: '/events', queryParams: ['orderByChild=date'] },
    { path: '/categories' },
    { path: '/participations' },
    { path: '/uploadedCategoryLogos' },
  ]),
  connect(state => ({
    events: state.firebase.data.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { profile } }) => ({ profile })),
)(EventModal);
