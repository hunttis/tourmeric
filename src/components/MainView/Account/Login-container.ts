import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Login from './Login';
import { ReduxState } from '~/models/ReduxState';

export default compose(connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })))(withRouter<any>(Login));
