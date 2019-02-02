import { connect } from 'react-redux';
import { compose } from 'redux';
import { getActiveLanguage } from 'react-localize-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import EventCalendar from './EventCalendar';

export default compose(
  connect(state => ({
    settings: state.firebase.data.settings,
    events: state.firebase.ordered.events,
    categories: state.firebase.data.categories,
    activeLanguage: getActiveLanguage(state.locale).code,
    location: state.router.location,
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
    isAdmin: _.get(state, 'firebase.profile.role', 'user') === 'admin',
  })),
  connect(({ firebase: { profile } }) => ({ profile })),
)(withRouter(EventCalendar));
