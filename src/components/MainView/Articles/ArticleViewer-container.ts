import { compose } from 'redux';
import { connect } from 'react-redux';

import _ from 'lodash';
import { ArticleViewer } from './ArticleViewer';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  connect((state: ReduxState) => {
    const articleId = _.last(state.router.location.pathname.split('/'));
    return {
      article: state.firebase.data.articles[articleId!],
    };
  }),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(ArticleViewer) as React.ComponentType<any>;
