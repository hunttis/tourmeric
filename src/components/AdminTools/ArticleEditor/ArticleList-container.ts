import { connect } from 'react-redux';
import { compose } from 'redux';

import { withRouter } from 'react-router-dom';
import { ArticleList } from './ArticleList';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  connect(
    (state: ReduxState) => ({
      articles: state.firebase.data.articles,
      uploadedArticleImages: state.firebase.data.uploadedArticleImages,
      settings: state.firebase.data.settings,
    }),
  ),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withRouter<any, any>(ArticleList)) as React.ComponentType<any>;
