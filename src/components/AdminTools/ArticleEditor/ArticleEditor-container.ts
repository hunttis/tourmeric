import { connect } from 'react-redux';
import { compose } from 'redux';

import ArticleEditor from './ArticleEditor';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect(
    (state: ReduxState) => ({
      articles: state.firebase.data.articles,
      uploadedArticleImages: state.firebase.ordered.uploadedArticleImages,
      settings: state.firebase.data.settings,
    }),
  ),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(ArticleEditor) as React.ComponentType<any>;
