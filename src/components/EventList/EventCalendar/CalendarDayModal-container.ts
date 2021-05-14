import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import { setReturnLocation } from '../../../actions/eventEditorActions';
import { CalendarDayModal } from './CalendarDayModal';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
    isAdmin: _.get(state, 'firebase.profile.role', 'user') === 'admin',
    setReturnLocation: (returnLocation: string) => setReturnLocation(returnLocation),
  })),
)(withRouter<any, any>(CalendarDayModal));
