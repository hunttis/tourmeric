import { connect } from 'react-redux';
import { compose } from 'redux';

import AdminEventList from './AdminEventList';

export default compose(
  connect(state => ({
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(AdminEventList);
