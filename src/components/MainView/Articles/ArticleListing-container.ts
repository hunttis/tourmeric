import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { ArticleListing } from './ArticleListing';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
    articles: state.firebase.data.articles,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withRouter<any, any>(ArticleListing)) as React.ComponentType<any>;
