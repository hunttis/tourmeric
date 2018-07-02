import { connect } from 'react-redux';
import { compose } from 'redux';
import { getActiveLanguage } from 'react-localize-redux';
import ValidatedDateField from './ValidatedDateField';


export default compose(
  connect(state => ({
    activeLanguage: getActiveLanguage(state.locale).code,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(ValidatedDateField);
