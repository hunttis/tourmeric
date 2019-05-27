import { compose } from 'redux';
import { connect } from 'react-redux';
import Register from './Register';
import { ReduxState } from '~/models/ReduxState';

export default compose(connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })))(Register);
