import { compose } from 'redux';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';

import Today from './Today';
import { ReduxState } from '~/models/ReduxState';

const componentWrapper = compose(
  connect((state: ReduxState) => ({
    events: state.firebase.ordered.events,
    eventsongoing: state.firebase.ordered.eventsongoing,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    userid: state.firebase.auth.uid,
    settings: state.firebase.data.settings,
    languages: state.localize.languages,
    uploadedCategoryLogos: state.firebase.data.uploadedCategoryLogos,
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withLocalize<any>(Today)) as React.ComponentType<any>;

componentWrapper.displayName = 'Today';

export default componentWrapper;
