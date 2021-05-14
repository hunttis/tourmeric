import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { ArticleLoader } from './ArticleLoader';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/articles', queryParams: ['orderByChild=createDate'] },
    { path: '/uploadedArticleImages' },
  ]),
  connect((state: ReduxState) => ({
    articles: state.firebase.data.articles,
    uploadedArticleImages: state.firebase.data.uploadedArticleImages,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(ArticleLoader) as React.ComponentType<any>;
