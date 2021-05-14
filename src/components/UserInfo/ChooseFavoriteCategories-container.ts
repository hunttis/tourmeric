import { connect } from 'react-redux';
import { compose } from 'redux';

import ChooseFavoriteCategories from './ChooseFavoriteCategories';
import { ReduxState } from '../../models/ReduxState';

export default compose(
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
  connect((state: ReduxState) => ({
    categories: state.firebase.data.categories,
  })),
)(ChooseFavoriteCategories) as React.ComponentType<any>;
