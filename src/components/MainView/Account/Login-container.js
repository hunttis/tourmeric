import { compose } from 'redux';
import { connect } from 'react-redux';
import Login from './Login';

export default compose(connect(({ firebase: { auth, profile } }) => ({ auth, profile })))(Login);
