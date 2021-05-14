import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import _ from 'lodash';
import { Articles } from './Articles';
import { ReduxState } from '../../../models/ReduxState';

const componentWrapper = compose(
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
    articles: state.firebase.data.articles,
    isAdmin: _.get(state, 'firebase.profile.role', 'user') === 'admin',
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withRouter<any, any>(Articles)) as React.ComponentType<any>;

componentWrapper.displayName = 'Articles';

export default componentWrapper;
