import { compose } from 'redux';
import { connect } from 'react-redux';

import { StoreInfo} from './StoreInfo';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { profile } }: ReduxState) => ({ profile })),
)(StoreInfo) as React.ComponentType<any>;
