import { connect } from 'react-redux';
import { compose } from 'redux';
import { withLocalize } from 'react-localize-redux';

import { EditorForm } from './EditorForm';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    settings: state.firebase.data.settings,
    location: state.router.location,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withLocalize<any>(EditorForm)) as React.ComponentType<any>;
