import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';

import { withRouter } from 'react-router-dom';
import { ArticleMarkdown } from './ArticleMarkdown';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect(
    (state: ReduxState) => {
      const articleId = _.last(state.router.location.pathname.split('/'));
      return ({
        articleId,
        article: state.firebase.data.articles[articleId!],
        uploadedArticleImages: state.firebase.ordered.uploadedArticleImages,
        settings: state.firebase.data.settings,
      });
    },
  ),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withRouter<any, any>(ArticleMarkdown)) as React.ComponentType<any>;
