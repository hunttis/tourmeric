import { connect } from 'react-redux';
import { compose } from 'redux';

import ValidatedDropdown from './ValidatedDropdown';

export default compose(connect(({ firebase: { auth, profile } }) => ({ auth, profile })))(ValidatedDropdown);
