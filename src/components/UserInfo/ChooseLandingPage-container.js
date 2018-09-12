import { connect } from 'react-redux';
import { compose } from 'redux';
import ChooseLandingPage from './ChooseLandingPage';

export default compose(
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(ChooseLandingPage);
