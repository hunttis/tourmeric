import { connect } from 'react-redux';
import { compose } from 'redux';

import { PersonalInfoEditor } from './PersonalInfoEditor';

export default compose(
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(PersonalInfoEditor);
