import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { isLoaded, isEmpty } from 'react-redux-firebase';

import UserEditor from './UserEditor/UserEditor-container';
import HighlightEditor from './HighlightEditor/HighlightEditor-container';
import StoreInfoEditor from './StoreInfoEditor/StoreInfoEditor-container';
import NewsEditor from './NewsEditor/NewsEditor-container';
import CompanyInfoEditor from './CompanyInfoEditor/CompanyInfoEditor-container';
import StoreCreditCategoryEditor from './StoreCredit/StoreCreditCategoryEditor-container';
import StoreCreditCategoryLoader from './AdminLoaders/StoreCreditCategoryLoader-container';
import UsersLoader from './AdminLoaders/UsersLoader-container';
import StoreCreditReport from './StoreCredit/StoreCreditReport-container';

export default class AdminTools extends Component {

  state = { activeItem: null }

  switchActiveTab(type) {
    this.setState({ activeItem: type });
  }

  render() {
    const { profile } = this.props;

    const isProfileLoaded = isLoaded(profile);
    const isLoggedIn = isProfileLoaded && !isEmpty(profile);
    const isAdmin = isLoggedIn && _.get(profile, 'role', 'user') === 'admin';

    if (!isAdmin) {
      return <div />;
    }

    const activePage = this.state.activeItem || _.get(profile, 'landingSubpage', 'users');

    const userVisible = activePage === 'users';
    const highlightVisible = activePage === 'highlights';
    const storeInfoVisible = activePage === 'storeinfo';
    const newsVisible = activePage === 'news';
    const companyInfoVisible = activePage === 'companyinfo';
    const storeCreditCategoriesVisible = activePage === 'storecreditcategories';
    const storeCreditReportVisible = activePage === 'storecreditreport';

    return (
      <div>
        <div className="tabs is-boxed is-marginless is-multiline">
          <ul>
            <AdminToolsTab isActive={userVisible} switchAction={() => this.switchActiveTab('users')} icon="fa-users" translationKey="users" />
            <AdminToolsTab isActive={highlightVisible} switchAction={() => this.switchActiveTab('highlights')} icon="fa-lightbulb" translationKey="highlights" />
            <AdminToolsTab isActive={storeInfoVisible} switchAction={() => this.switchActiveTab('storeinfo')} icon="fa-store" translationKey="storeinfo" />
            <AdminToolsTab isActive={newsVisible} switchAction={() => this.switchActiveTab('news')} icon="fa-newspaper" translationKey="news" />
            <AdminToolsTab isActive={companyInfoVisible} switchAction={() => this.switchActiveTab('companyinfo')} icon="fa-warehouse" translationKey="companyinfo" />
            <AdminToolsTab isActive={storeCreditCategoriesVisible} switchAction={() => this.switchActiveTab('storecreditcategories')} icon="fa-money-bill" translationKey="storecreditcategories" />
            <AdminToolsTab isActive={storeCreditReportVisible} switchAction={() => this.switchActiveTab('storecreditreport')} icon="fa-chart-area" translationKey="storecreditreport" />
          </ul>
        </div>
        <section className="section">
          <StoreCreditCategoryLoader />
          <UsersLoader />
          {userVisible && <UserEditor />}
          {highlightVisible && <HighlightEditor />}
          {storeInfoVisible && <StoreInfoEditor />}
          {newsVisible && <NewsEditor />}
          {companyInfoVisible && <CompanyInfoEditor />}
          {storeCreditCategoriesVisible && <StoreCreditCategoryEditor />}
          {storeCreditReportVisible && <StoreCreditReport />}
        </section>
      </div>
    );
  }
}

const AdminToolsTab = ({ tabid, isActive, switchAction, icon, translationKey }) => (
  <li id={tabid} className={`has-icon ${isActive && 'is-active'}`}>
    <a onClick={switchAction}>
      <span className="icon is-small"><i className={`fas ${icon}`} aria-hidden="true" /></span>
      <span><Translate id={translationKey} /></span>
    </a>
  </li>
);

AdminTools.propTypes = {
  profile: PropTypes.object,
};

AdminToolsTab.propTypes = {
  tabid: PropTypes.string,
  isActive: PropTypes.bool,
  switchAction: PropTypes.func,
  icon: PropTypes.string,
  translationKey: PropTypes.string,
};
