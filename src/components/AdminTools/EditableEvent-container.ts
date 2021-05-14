import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { setReturnLocation } from '../../actions/eventEditorActions';
import { EditableEvent } from './EditableEvent';
import { ReduxState } from '../../models/ReduxState';

export const EditableEventContainer = compose(
  connect((state: ReduxState) => ({
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    settings: state.firebase.data.settings,
    setReturnLocation: (returnLocation: string) => setReturnLocation(returnLocation),
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withRouter<any, any>(EditableEvent)) as React.ComponentType<any>;
