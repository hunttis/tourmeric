import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Login from './Login';

export default compose(connect(({ firebase: { auth, profile } }) => ({ auth, profile })))(withRouter(Login));
