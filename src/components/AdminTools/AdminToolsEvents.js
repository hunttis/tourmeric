import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import _ from 'lodash';
import AdminEventList from './AdminEventList-container';
import CategoryEditor from './CategoryEditor/CategoryEditor-container';
import ParticipationEditor from './ParticipationEditor/ParticipationEditor-container';
import CategoryLogoUploader from './CategoryEditor/CategoryLogoUploader-container';
import { AdminToolsTab } from './AdminToolsTab';

export default class AdminToolsEvents extends Component {

  state = { activeItem: null }

  switchActiveTab(type) {
    this.setState({ activeItem: type });
  }

  render() {
    const { events, profile } = this.props;

    const isProfileLoaded = isLoaded(profile);
    const isLoggedIn = isProfileLoaded && !isEmpty(profile);
    const isAdmin = isLoggedIn && _.get(profile, 'role', 'user') === 'admin';

    if (!isAdmin) {
      return <div />;
    }

    if (!isLoaded(events)) {
      return <button className="is-loading" />;
    }

    if (isLoaded(events)) {

      const activePage = this.state.activeItem || _.get(profile, 'landingSubpage', 'unpublished');

      const unpublishedEventsVisible = activePage === 'unpublished';
      const publishedEventsVisible = activePage === 'published';
      const categoryVisible = activePage === 'category';
      const categoryLogoUploaderVisible = activePage === 'categorylogouploader';
      const participationVisible = activePage === 'participations';

      return (
        <div>
          <div className="tabs is-boxed is-marginless is-multiline">
            <ul>
              <AdminToolsTab isActive={unpublishedEventsVisible} switchAction={() => this.switchActiveTab('unpublished')} icon="fa-pencil-alt" translationKey="unpublishedevents" />
              <AdminToolsTab isActive={publishedEventsVisible} switchAction={() => this.switchActiveTab('published')} icon="fa-book" translationKey="publishedevents" />
              <AdminToolsTab isActive={categoryVisible} switchAction={() => this.switchActiveTab('category')} icon="fa-bars" translationKey="categories" />
              <AdminToolsTab isActive={categoryLogoUploaderVisible} switchAction={() => this.switchActiveTab('categorylogouploader')} icon="fa-bars" translationKey="categorylogouploader" />
              <AdminToolsTab isActive={participationVisible} switchAction={() => this.switchActiveTab('participations')} icon="fa-clipboard-list" translationKey="participations" />
            </ul>
          </div>
          <section className="section">
            {unpublishedEventsVisible && <AdminEventList published={false} showNewEventButton />}
            {publishedEventsVisible && <AdminEventList published showNewEventButton={false} />}
            {categoryVisible && <CategoryEditor />}
            {categoryLogoUploaderVisible && <CategoryLogoUploader />}
            {participationVisible && <ParticipationEditor />}
          </section>
        </div>
      );
    }

    if (isLoaded(events) && isEmpty(events)) {
      return (
        <AdminEventList events={[]} showNewEventButton />
      );
    }

    return <button className="is-loading" />;
  }
}

AdminToolsEvents.propTypes = {
  events: PropTypes.object,
  profile: PropTypes.object,
};
