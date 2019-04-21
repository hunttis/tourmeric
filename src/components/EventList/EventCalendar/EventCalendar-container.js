import { connect } from 'react-redux';
import { compose } from 'redux';
import { getActiveLanguage } from 'react-localize-redux';
import { withRouter } from 'react-router-dom';

import { setReturnLocation } from '../../../actions/eventEditorActions';
import EventCalendar from './EventCalendar';

export default compose(
  connect(state => ({
    settings: state.firebase.data.settings,
    events: state.firebase.ordered.events,
    eventsongoing: state.firebase.ordered.eventsongoing,
    categories: state.firebase.data.categories,
    activeLanguage: getActiveLanguage(state.locale).code,
    location: state.router.location,
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
  }), dispatch => ({
    setReturnLocation: returnLocation => dispatch(setReturnLocation(returnLocation)),
  })),
  connect(({ firebase: { profile } }) => ({ profile })),
)(withRouter(EventCalendar));
