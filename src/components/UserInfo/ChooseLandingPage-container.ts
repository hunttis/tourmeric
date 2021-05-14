import { connect } from 'react-redux';
import { compose } from 'redux';
import ChooseLandingPage from './ChooseLandingPage';
import { ReduxState } from '../../models/ReduxState';

export default compose(
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(ChooseLandingPage) as React.ComponentType<any>;
