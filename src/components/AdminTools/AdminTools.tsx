import React, { Component } from 'react';
import _ from 'lodash';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { Route, Switch } from 'react-router-dom';

import { Location, History } from 'history';
import UserEditor from './UserEditor/UserEditor-container';
import HighlightEditor from './HighlightEditor/HighlightEditor-container';
import StoreInfoEditor from './StoreInfoEditor/StoreInfoEditor-container';
import NewsEditor from './NewsEditor/NewsEditor-container';
import CompanyInfoEditor from './CompanyInfoEditor/CompanyInfoEditor-container';
import StoreCreditCategoryEditor from './StoreCredit/StoreCreditCategoryEditor-container';
import StoreCreditCategoryLoader from './AdminLoaders/StoreCreditCategoryLoader-container';
import UsersLoader from './AdminLoaders/UsersLoader-container';
import StoreCreditReport from './StoreCredit/StoreCreditReport-container';
import StoreCreditRowEditor from './StoreCredit/StoreCreditRowEditor-container';
import { AdminToolsTab } from './AdminToolsTab';
import { FirebaseProfile } from '~/models/ReduxState';

interface Props {
  profile: FirebaseProfile;
  location: Location;
  history: History;
}

export class AdminTools extends Component<Props> {
  switchActiveTab(page: string) {
    this.props.history.push(`/admin/tools/${page}`);
  }

  render() {
    const { profile, location } = this.props;

    const isProfileLoaded = isLoaded(profile);
    const isLoggedIn = isProfileLoaded && !isEmpty(profile);
    const isAdmin = isLoggedIn && _.get(profile, 'role', 'user') === 'admin';

    if (!isAdmin) {
      return <div />;
    }

    let activeItem = location.pathname;
    if (activeItem === '/admin/tools') {
      activeItem = '/admin/tools/user';
    }

    return (
      <div>
        <StoreCreditCategoryLoader />
        <UsersLoader />
        <div className="tabs is-boxed is-marginless is-multiline">
          <ul>
            <AdminToolsTab
              isActive={activeItem === '/admin/tools/user'}
              switchAction={() => this.switchActiveTab('user')}
              icon="fa-users"
              translationKey="users"
            />
            <AdminToolsTab
              isActive={activeItem === '/admin/tools/highlights'}
              switchAction={() => this.switchActiveTab('highlights')}
              icon="fa-lightbulb"
              translationKey="highlights"
            />
            <AdminToolsTab
              isActive={activeItem === '/admin/tools/storeinfo'}
              switchAction={() => this.switchActiveTab('storeinfo')}
              icon="fa-store"
              translationKey="storeinfo"
            />
            <AdminToolsTab
              isActive={activeItem === '/admin/tools/news'}
              switchAction={() => this.switchActiveTab('news')}
              icon="fa-newspaper"
              translationKey="news"
            />
            <AdminToolsTab
              isActive={activeItem === '/admin/tools/companyinfo'}
              switchAction={() => this.switchActiveTab('companyinfo')}
              icon="fa-warehouse"
              translationKey="companyinfo"
            />
            <AdminToolsTab
              isActive={activeItem === '/admin/tools/storecreditcategory'}
              switchAction={() => this.switchActiveTab('storecreditcategory')}
              icon="fa-money-bill"
              translationKey="storecreditcategories"
            />
            <AdminToolsTab
              isActive={activeItem === '/admin/tools/storecreditreport'}
              switchAction={() => this.switchActiveTab('storecreditreport')}
              icon="fa-chart-area"
              translationKey="storecreditreport"
            />
          </ul>
        </div>
        <div className="section">
          <Switch>
            <Route exact path="/admin/tools" component={UserEditor} />
            <Route path="/admin/tools/user" component={UserEditor} />
            <Route path="/admin/tools/highlights" component={HighlightEditor} />
            <Route path="/admin/tools/storeinfo" component={StoreInfoEditor} />
            <Route path="/admin/tools/news" component={NewsEditor} />
            <Route
              path="/admin/tools/companyinfo"
              component={CompanyInfoEditor}
            />
            <Route
              path="/admin/tools/storecreditcategory"
              component={StoreCreditCategoryEditor}
            />
            <Route
              path="/admin/tools/storecreditreport"
              component={StoreCreditReport}
            />
            <Route
              path="/admin/tools/storecreditrow/:userid/:id"
              component={StoreCreditRowEditor}
            />
          </Switch>
        </div>
      </div>
    );
  }
}
