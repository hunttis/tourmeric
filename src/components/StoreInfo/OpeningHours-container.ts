import { compose } from 'redux';
import { connect } from 'react-redux';

import { OpeningHours } from './OpeningHours';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(OpeningHours) as React.ComponentType<any>;
