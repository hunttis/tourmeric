import { connect } from 'react-redux';
import { compose } from 'redux';
import { getActiveLanguage } from 'react-localize-redux';
import ValidatedDateField from './ValidatedDateField';
import { ReduxState } from '~/models/ReduxState';


export default compose(
  connect((state: ReduxState) => ({
    activeLanguage: getActiveLanguage(state.locale).code,
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(ValidatedDateField) as React.ComponentType<any>;
