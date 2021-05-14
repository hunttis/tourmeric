import { connect } from 'react-redux';
import { compose } from 'redux';

import { UserEntry } from './UserEntry';
import { ReduxState } from '../../../models/ReduxState';

export default compose(connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })))(UserEntry) as React.ComponentType<any>;
