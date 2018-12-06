import { compose } from 'redux';
import { connect } from 'react-redux';

import { OpeningHours } from './OpeningHours';

export default compose(
  connect(state => ({
    settings: state.firebase.data.settings,
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(OpeningHours);
