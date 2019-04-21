import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import { setReturnLocation } from '../../../actions/eventEditorActions';
import { CalendarDayModal } from './CalendarDayModal';

interface CalendarDayModalState {
  firebase: any;
}

export default compose(
  connect((state: CalendarDayModalState) => ({
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
    isAdmin: _.get(state, 'firebase.profile.role', 'user') === 'admin',
  }), dispatch => ({
    setReturnLocation: (returnLocation: string) => dispatch(setReturnLocation(returnLocation)),
  })),
)(withRouter<any>(CalendarDayModal));
