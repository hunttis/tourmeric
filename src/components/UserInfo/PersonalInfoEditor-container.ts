import { connect } from 'react-redux';
import { compose } from 'redux';

import { PersonalInfoEditor } from './PersonalInfoEditor';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(PersonalInfoEditor) as React.ComponentType<any>;
