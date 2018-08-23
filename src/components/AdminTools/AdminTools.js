import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import loadingImage from '../../images/Ripple-1s-64px.svg';
import AdminEventList from './AdminEventList-container';
import UserEditor from './UserEditor/UserEditor-container';
import HighlightEditor from './HighlightEditor/HighlightEditor-container';
import StoreInfoEditor from './StoreInfoEditor/StoreInfoEditor-container';
import NewsEditor from './NewsEditor/NewsEditor-container';

export default class AdminTools extends Component {

  state = { activeItem: 'user' }

  switchActiveTab(type) {
    this.setState({ activeItem: type });
  }

  render() {
    const { events } = this.props;
    if (!isLoaded(events)) {
      return <div><img src={loadingImage} alt="Loading" /></div>;
    }

    if (isLoaded(events) && !isEmpty(events)) {
      const userVisible = this.state.activeItem === 'user';
      const highlightVisible = this.state.activeItem === 'highlight';
      const storeInfoVisible = this.state.activeItem === 'storeinfo';
      const newsVisible = this.state.activeItem === 'news';

      return (
        <div>
          <div className="tabs is-boxed is-marginless is-multiline">
            <ul>
              <AdminToolsTab isActive={userVisible} switchAction={() => this.switchActiveTab('user')} icon="fa-users" translationKey="users" />
              <AdminToolsTab isActive={highlightVisible} switchAction={() => this.switchActiveTab('highlight')} icon="fa-lightbulb" translationKey="highlights" />
              <AdminToolsTab isActive={storeInfoVisible} switchAction={() => this.switchActiveTab('storeinfo')} icon="fa-store" translationKey="storeinfo" />
              <AdminToolsTab isActive={newsVisible} switchAction={() => this.switchActiveTab('news')} icon="fa-store" translationKey="news" />
            </ul>
          </div>
          <section className="section">
            {userVisible && <UserEditor />}
            {highlightVisible && <HighlightEditor />}
            {storeInfoVisible && <StoreInfoEditor />}
            {newsVisible && <NewsEditor />}
          </section>
        </div>
      );
    }

    if (isLoaded(events) && isEmpty(events)) {
      return (
        <AdminEventList events={[]} showNewEventButton />
      );
    }

    return <div><img src={loadingImage} alt="Loading" /></div>;
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

AdminToolsTab.propTypes = {
  tabid: PropTypes.string,
  isActive: PropTypes.bool,
  switchAction: PropTypes.func,
  icon: PropTypes.string,
  translationKey: PropTypes.string,
};


AdminTools.propTypes = {
  events: PropTypes.object,
};
