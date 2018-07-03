import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import loadingImage from '../../images/Ripple-1s-64px.svg';
import AdminEventList from './AdminEventList-container';
import CategoryEditor from './CategoryEditor/CategoryEditor-container';
import UserEditor from './UserEditor/UserEditor-container';
import ParticipationEditor from './ParticipationEditor/ParticipationEditor-container';
import CategoryLogoUploader from './CategoryEditor/CategoryLogoUploader-container';
import StoreCreditEditor from './StoreCredit/StoreCreditEditor-container';

export default class AdminTools extends Component {

  state = { activeItem: 'storecredit' }

  switchActiveTab(type) {
    this.setState({ activeItem: type });
  }

  render() {
    const { events } = this.props;
    if (!isLoaded(events)) {
      return <div><img src={loadingImage} alt="Loading" /></div>;
    } else if (isLoaded(events) && !isEmpty(events)) {
      const sortedEvents = _.sortBy(Object.entries(events), ['date', 'time']);
      const publishedEvents = sortedEvents.filter(event => event[1].published);
      const unpublishedEvents = sortedEvents.filter(event => !event[1].published);

      const unpublishedEventsVisible = this.state.activeItem === 'unpublished';
      const publishedEventsVisible = this.state.activeItem === 'published';
      const categoryVisible = this.state.activeItem === 'category';
      const categoryLogoUploaderVisible = this.state.activeItem === 'categorylogouploader';
      const userVisible = this.state.activeItem === 'user';
      const participationVisible = this.state.activeItem === 'participation';
      const storeCreditVisible = this.state.activeItem === 'storecredit';

      return (
        <div>
          <div className="tabs is-boxed is-marginless is-multiline">
            <ul>
              <AdminToolsTab isActive={unpublishedEventsVisible} switchAction={() => this.switchActiveTab('unpublished')} icon="fa-pencil-alt" translationKey="unpublishedevents" />
              <AdminToolsTab isActive={publishedEventsVisible} switchAction={() => this.switchActiveTab('published')} icon="fa-book" translationKey="publishedevents" />
              <AdminToolsTab isActive={categoryVisible} switchAction={() => this.switchActiveTab('category')} icon="fa-bars" translationKey="categories" />
              <AdminToolsTab isActive={categoryLogoUploaderVisible} switchAction={() => this.switchActiveTab('categorylogouploader')} icon="fa-bars" translationKey="categorylogouploader" />
              <AdminToolsTab isActive={userVisible} switchAction={() => this.switchActiveTab('user')} icon="fa-users" translationKey="users" />
              <AdminToolsTab isActive={participationVisible} switchAction={() => this.switchActiveTab('participation')} icon="fa-clipboard-list" translationKey="participations" />
              <AdminToolsTab isActive={storeCreditVisible} switchAction={() => this.switchActiveTab('storecredit')} icon="fa-coins" translationKey="storecredit" />
            </ul>
          </div>
          <section className="section">
            {unpublishedEventsVisible && <AdminEventList events={unpublishedEvents} showNewEventButton />}
            {publishedEventsVisible && <AdminEventList events={publishedEvents} showNewEventButton={false} />}
            {categoryVisible && <CategoryEditor />}
            {categoryLogoUploaderVisible && <CategoryLogoUploader />}
            {userVisible && <UserEditor />}
            {participationVisible && <ParticipationEditor />}
            {storeCreditVisible && <StoreCreditEditor />}
          </section>
        </div>
      );
    } else if (isLoaded(events) && isEmpty(events)) {
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
