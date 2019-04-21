import { connect } from 'react-redux';
import { compose } from 'redux';
import { getActiveLanguage } from 'react-localize-redux';
import { SingleEvent } from './SingleEvent';

export default compose(
  connect(state => ({
    events: state.firebase.data.events,
    eventsongoing: state.firebase.data.eventsongoing,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    userid: state.firebase.auth.uid,
    settings: state.firebase.data.settings,
    languages: state.locale.languages,
    activeLanguage: getActiveLanguage(state.locale).code,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(SingleEvent);
