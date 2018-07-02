import { connect } from 'react-redux';
import { compose } from 'redux';

import { UserEntry } from './UserEntry';

export default compose(connect(({ firebase: { auth, profile } }) => ({ auth, profile })))(UserEntry);
