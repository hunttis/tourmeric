import { compose } from 'redux';
import { connect } from 'react-redux';
import { getActiveLanguage } from 'react-localize-redux';

import Today from './Today';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    events: state.firebase.ordered.events,
    eventsongoing: state.firebase.ordered.eventsongoing,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    userid: state.firebase.auth.uid,
    settings: state.firebase.data.settings,
    languages: state.locale.languages,
    uploadedCategoryLogos: state.firebase.data.uploadedCategoryLogos,
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
    activeLanguage: getActiveLanguage(state.locale).code,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(Today) as React.ComponentType<any>;
