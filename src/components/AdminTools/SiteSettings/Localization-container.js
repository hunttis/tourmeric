import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';
import { Localization } from './Localization';

export default compose(
  connect(state => ({
    settings: state.firebase.data.settings,
    showDefaultButton: _.get(state, 'firebase.data.settings.dateFormat', 'DD.MM.YYYY') !== 'DD.MM.YYYY',
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(Localization);
