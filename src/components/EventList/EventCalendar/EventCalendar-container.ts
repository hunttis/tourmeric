import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withLocalize } from 'react-localize-redux';

import { setReturnLocation } from '../../../actions/eventEditorActions';
import EventCalendar from './EventCalendar';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
    events: state.firebase.ordered.events,
    eventsongoing: state.firebase.ordered.eventsongoing,
    categories: state.firebase.data.categories,
    location: state.router.location,
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
    setReturnLocation: (returnLocation: string) => setReturnLocation(returnLocation),
  })),
  connect(({ firebase: { profile } }: ReduxState) => ({ profile })),
)(withLocalize<any>(withRouter<any, any>(EventCalendar))) as React.ComponentType<any>;
