import { connect } from 'react-redux';
import { compose } from 'redux';
import { getActiveLanguage } from 'react-localize-redux';
import { withRouter } from 'react-router-dom';
import EventCalendar from './EventCalendar';

export default compose(
  connect(state => ({
    events: state.firebase.ordered.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    userid: state.firebase.auth.uid,
    settings: state.firebase.data.settings,
    languages: state.locale.languages,
    uploadedCategoryLogos: state.firebase.data.uploadedCategoryLogos,
    activeLanguage: getActiveLanguage(state.locale).code,
    location: state.router.location,
  })),
  connect(({ firebase: { profile } }) => ({ profile })),
)(withRouter(EventCalendar));
