import { connect } from 'react-redux';
import { compose } from 'redux';

import ChooseFavoriteCategories from './ChooseFavoriteCategories';

export default compose(
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
  connect(state => ({
    categories: state.firebase.data.categories,
  })),
)(ChooseFavoriteCategories);
