import { compose } from 'redux';
import { connect } from 'react-redux';
import { getActiveLanguage } from 'react-localize-redux';

import Today from './Today';

export default compose(
  connect(state => ({
    events: state.firebase.ordered.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    userid: state.firebase.auth.uid,
    settings: state.firebase.data.settings,
    languages: state.locale.languages,
    uploadedCategoryLogos: state.firebase.data.uploadedCategoryLogos,
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
    activeLanguage: getActiveLanguage(state.locale).code,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(Today);
