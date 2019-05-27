import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';
import { Localization } from './Localization';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
    showDefaultButton: _.get(state, 'firebase.data.settings.dateFormat', 'DD.MM.YYYY') !== 'DD.MM.YYYY',
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(Localization) as React.ComponentType<any>;
