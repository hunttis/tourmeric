import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

import ValidatedEditableField from './ValidatedEditableField';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    categories: state.firebase.data.categories,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(injectIntl<any>(ValidatedEditableField)) as React.ComponentType<any>;
