import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import { Route, Switch } from 'react-router-dom';
import { AdminToolsTab } from './AdminToolsTab';
import { UnpublishedAdminEventList } from './UnpublishedAdminEventList';
import { PublishedAdminEventList } from './PublishedAdminEventList';
import CategoryEditor from './CategoryEditor/CategoryEditor-container';
import ParticipationEditor from './ParticipationEditor/ParticipationEditor-container';
import CategoryLogoUploader from './CategoryEditor/CategoryLogoUploader-container';
import NewEventEditor from './EventEditor/NewEventEditor-container';
import ExistingEventEditor from './EventEditor/ExistingEventEditor-container';

export default class AdminToolsEvents extends Component {

  switchActiveTab(page) {
    this.props.history.push(`/admin/events/${page}`);
  }

  render() {
    const { events, profile, location } = this.props;

    const isProfileLoaded = isLoaded(profile);
    const isLoggedIn = isProfileLoaded && !isEmpty(profile);
    const isAdmin = isLoggedIn && _.get(profile, 'role', 'user') === 'admin';

    if (!isAdmin) {
      return <div />;
    }

    if (!isLoaded(events)) {
      return <button className="is-loading" />;
    }

    if (isLoaded(events) && !isEmpty(events)) {

      let activeItem = location.pathname;
      if (activeItem === '/admin/events') {
        activeItem = '/admin/events/unpublished';
      }

      return (
        <div>
          <div className="tabs is-boxed is-marginless is-multiline">
            <ul>
              <AdminToolsTab isActive={activeItem === '/admin/events/unpublished'} switchAction={() => this.switchActiveTab('unpublished')} icon="fa-pencil-alt" translationKey="unpublishedevents" />
              <AdminToolsTab isActive={activeItem === '/admin/events/published'} switchAction={() => this.switchActiveTab('published')} icon="fa-book" translationKey="publishedevents" />
              <AdminToolsTab isActive={activeItem === '/admin/events/category'} switchAction={() => this.switchActiveTab('category')} icon="fa-bars" translationKey="categories" />
              <AdminToolsTab isActive={activeItem === '/admin/events/categorylogouploader'} switchAction={() => this.switchActiveTab('categorylogouploader')} icon="fa-bars" translationKey="categorylogouploader" />
              <AdminToolsTab isActive={activeItem === '/admin/events/participations'} switchAction={() => this.switchActiveTab('participations')} icon="fa-clipboard-list" translationKey="participations" />
            </ul>
          </div>
          <Switch>
            <Route exact path="/admin/events" component={UnpublishedAdminEventList} />
            <Route path="/admin/events/unpublished" component={UnpublishedAdminEventList} />
            <Route path="/admin/events/published" component={PublishedAdminEventList} />
            <Route path="/admin/events/category" component={CategoryEditor} />
            <Route path="/admin/events/categorylogouploader" component={CategoryLogoUploader} />
            <Route path="/admin/events/participations" component={ParticipationEditor} />
            <Route path="/admin/events/newevent" component={NewEventEditor} />
            <Route path="/admin/events/editevent" component={ExistingEventEditor} />
          </Switch>
        </div>
      );
    }

    if (isLoaded(events) && isEmpty(events)) {
      return (
        <div><Translate id="noevents" /></div>
      );
    }

    return <button className="button is-loading"><Translate id="loading" /></button>;
  }
}

AdminToolsEvents.propTypes = {
  events: PropTypes.object,
  profile: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};
