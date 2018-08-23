import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';
import PropTypes from 'prop-types';
import loadingImage from '../../images/Ripple-1s-64px.svg';
import AdminEventList from './AdminEventList-container';
import CategoryEditor from './CategoryEditor/CategoryEditor-container';
import ParticipationEditor from './ParticipationEditor/ParticipationEditor-container';
import CategoryLogoUploader from './CategoryEditor/CategoryLogoUploader-container';
import { AdminToolsTab } from './AdminToolsTab';

export default class AdminToolsEvents extends Component {

  state = { activeItem: 'unpublished' }

  switchActiveTab(type) {
    this.setState({ activeItem: type });
  }

  render() {
    const { events } = this.props;
    if (!isLoaded(events)) {
      return <div><img src={loadingImage} alt="Loading" /></div>;
    }

    if (isLoaded(events) && !isEmpty(events)) {
      const sortedEvents = _.sortBy(Object.entries(events), ['date', 'time']);
      const publishedEvents = sortedEvents.filter(event => event[1].published);
      const unpublishedEvents = sortedEvents.filter(event => !event[1].published);

      const unpublishedEventsVisible = this.state.activeItem === 'unpublished';
      const publishedEventsVisible = this.state.activeItem === 'published';
      const categoryVisible = this.state.activeItem === 'category';
      const categoryLogoUploaderVisible = this.state.activeItem === 'categorylogouploader';
      const participationVisible = this.state.activeItem === 'participation';

      return (
        <div>
          <div className="tabs is-boxed is-marginless is-multiline">
            <ul>
              <AdminToolsTab isActive={unpublishedEventsVisible} switchAction={() => this.switchActiveTab('unpublished')} icon="fa-pencil-alt" translationKey="unpublishedevents" />
              <AdminToolsTab isActive={publishedEventsVisible} switchAction={() => this.switchActiveTab('published')} icon="fa-book" translationKey="publishedevents" />
              <AdminToolsTab isActive={categoryVisible} switchAction={() => this.switchActiveTab('category')} icon="fa-bars" translationKey="categories" />
              <AdminToolsTab isActive={categoryLogoUploaderVisible} switchAction={() => this.switchActiveTab('categorylogouploader')} icon="fa-bars" translationKey="categorylogouploader" />
              <AdminToolsTab isActive={participationVisible} switchAction={() => this.switchActiveTab('participation')} icon="fa-clipboard-list" translationKey="participations" />
            </ul>
          </div>
          <section className="section">
            {unpublishedEventsVisible && <AdminEventList events={unpublishedEvents} showNewEventButton />}
            {publishedEventsVisible && <AdminEventList events={publishedEvents} showNewEventButton={false} />}
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

    return <div><img src={loadingImage} alt="Loading" /></div>;
  }
}

AdminToolsEvents.propTypes = {
  events: PropTypes.object,
};
