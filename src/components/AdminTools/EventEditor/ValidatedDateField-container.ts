import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

import ValidatedDateField from './ValidatedDateField';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(injectIntl<any>(ValidatedDateField)) as React.ComponentType<any>;
