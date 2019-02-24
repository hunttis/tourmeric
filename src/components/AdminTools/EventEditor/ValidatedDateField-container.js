import { connect } from 'react-redux';
import { compose } from 'redux';
import { getActiveLanguage } from 'react-localize-redux';
import ValidatedDateField from './ValidatedDateField';


export default compose(
  connect(state => ({
    activeLanguage: getActiveLanguage(state.locale).code,
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(ValidatedDateField);
