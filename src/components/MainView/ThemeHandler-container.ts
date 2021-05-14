import { compose } from 'redux';
import { connect } from 'react-redux';

import ThemeHandler from './ThemeHandler';
import { ReduxState } from '../../models/ReduxState';


export default compose(
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { profile } }: ReduxState) => ({ profile })),
)(ThemeHandler) as React.ComponentType<any>;
