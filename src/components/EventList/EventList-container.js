import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { getActiveLanguage } from 'react-localize-redux';
import EventList from './EventList';

export default compose(
  firebaseConnect([
    { path: '/categories' },
    { path: '/participations' },
    { path: '/uploadedCategoryLogos' },
  ]),
  connect(state => ({
    events: state.firebase.ordered.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    userid: state.firebase.auth.uid,
    settings: state.firebase.data.settings,
    languages: state.locale.languages,
    uploadedCategoryLogos: state.firebase.data.uploadedCategoryLogos,
    activeLanguage: getActiveLanguage(state.locale).code,
  })),
  connect(({ firebase: { profile } }) => ({ profile })),
)(EventList);
