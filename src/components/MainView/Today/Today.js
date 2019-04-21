import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment/min/moment-with-locales';
import { extendMoment } from 'moment-range';
import { isLoaded } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import News from './News-container';
import EventCard from '../../EventList/EventCard/EventCard-container';
import EventModal from '../../EventList/EventModal-container';

const moment = extendMoment(Moment);

export default class Today extends Component {

  state = { shownItems: 'today', modalOpenEventId: null }

  findNextEvents(events) {
    const { profile } = this.props;
    const now = moment();
    const after7Days = moment().add(7, 'days');
    const hasDefinedFavorites = !_.isEmpty(profile.favoriteCategories) && !_.isEmpty(profile.favoriteCategories.trim());
    if (events) {
      const nextEvents = events.filter((eventEntry) => {
        const eventData = eventEntry.value;
        const eventDate = moment(eventData.date, 'YYYY-MM-DD');
        const isWithinAWeek = eventDate.isAfter(now, 'day') && eventDate.isBefore(after7Days, 'day');
        const isFavorite = !hasDefinedFavorites || profile.favoriteCategories.indexOf(eventData.category) !== -1;
        return eventData.published && isWithinAWeek && isFavorite;
      });
      return nextEvents;
    }
    return [];
  }

  findNextOngoingEvents(ongoingevents) {
    const { profile } = this.props;
    const range = moment.range(moment(), moment().add(7, 'days'));
    const hasDefinedFavorites = !_.isEmpty(profile.favoriteCategories) && !_.isEmpty(profile.favoriteCategories.trim());
    if (ongoingevents) {
      const nextEvents = ongoingevents.filter((eventEntry) => {
        const eventData = eventEntry.value;
        const eventDateRange = moment.range(moment(eventData.date, 'YYYY-MM-DD'), moment(eventData.endDate, 'YYYY-MM-DD'));
        const isWithinAWeek = range.overlaps(eventDateRange);
        const isFavorite = !hasDefinedFavorites || profile.favoriteCategories.indexOf(eventData.category) !== -1;
        return eventData.published && isWithinAWeek && isFavorite;
      });
      return nextEvents;
    }
    return [];
  }

  findTodaysEvents(events) {
    const { profile } = this.props;
    const hasDefinedFavorites = !_.isEmpty(profile.favoriteCategories) && !_.isEmpty(profile.favoriteCategories.trim());
    if (events) {

      const todaysEvents = events.filter((eventEntry) => {
        const eventData = eventEntry.value;
        const isFavorite = !hasDefinedFavorites || profile.favoriteCategories.indexOf(eventData.category) !== -1;

        if (eventData.published && moment(eventData.date, 'YYYY-MM-DD').isSame(moment(), 'day') && isFavorite) {
          return true;
        }
        return false;
      });
      return todaysEvents;
    }
    return [];
  }

  findTodaysOngoingEvents(eventsongoing) {
    const { profile } = this.props;
    const hasDefinedFavorites = !_.isEmpty(profile.favoriteCategories) && !_.isEmpty(profile.favoriteCategories.trim());
    if (eventsongoing) {
      const todaysOngoingEvents = eventsongoing.filter((eventEntry) => {
        const eventData = eventEntry.value;
        const isFavorite = !hasDefinedFavorites || profile.favoriteCategories.indexOf(eventData.category) !== -1;

        if (eventData.endDate) {
          return isFavorite && moment().isBetween(moment(eventData.date, 'YYYY-MM-DD'), moment(eventData.endDate, 'YYYY-MM-DD'), 'day', '[]');
        }
        return false;

      });
      return todaysOngoingEvents;
    }
    return [];
  }

  closeModal() {
    this.setState({ modalOpenEventId: null });
  }

  openModal(eventId) {
    this.setState({ modalOpenEventId: eventId });
  }

  togglePastEventFilter() {
    const { showPastEventsFilter } = this.state;
    this.setState({ showPastEventsFilter: !showPastEventsFilter });
  }

  modalItem(translationKey, content) {
    if (content) {
      return (
        <div className="column is-12">
          <div className="title"><Translate id={translationKey} /></div>
          <p>
            {content}
          </p>
        </div>
      );
    }
    return <div />;
  }


  switchView(newView) {
    this.setState({ shownItems: newView });
  }

  renderEventModal(eventEntry) {
    const eventId = eventEntry.key;
    if (eventEntry.key === this.state.modalOpenEventId) {
      return <EventModal
        key={`modal${eventId}`}
        eventId={eventId}
        closeModal={() => this.closeModal()}
      />;
    }
    return '';
  }

  renderTodaysEventItems(todaysEvents) {
    if (!_.isEmpty(todaysEvents)) {
      return (
        <Fragment>
          <div className="column is-2" />
          <div className="column is-4">
            <h1 className="title"><Translate id="todaysevents" /></h1>
            {todaysEvents.map((eventEntry) => {
              const eventId = eventEntry.key;

              return (
                <div key={eventId} className="columns today-view-cards-space">
                  <EventCard
                    eventId={eventId}
                    openModal={() => this.openModal(eventId)}
                  />
                </div>
              );

            })}
          </div>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <div className="column is-2" />
        <div className="column is-4">
          <h1 className="title"><Translate id="todaysevents" /></h1>
          <div className="has-text-warning"><Translate id="noeventstoday" /></div>
          <p>&nbsp;</p>
          <button className="button" onClick={() => this.switchView('future')}><Translate id="shownext7days" /></button>
        </div>
      </Fragment>
    );
  }

  renderTodaysOngoingEventItems(eventsongoing) {
    if (!_.isEmpty(eventsongoing)) {
      return (
        <Fragment>
          <div className="column is-4">
            <h1 className="title"><Translate id="ongoingevents" /></h1>
            {eventsongoing.map((eventEntry) => {
              const eventId = eventEntry.key;

              return (
                <div key={eventId} className="columns today-view-cards-space">
                  <EventCard
                    eventId={eventId}
                    openModal={() => this.openModal(eventId)}
                  />
                </div>
              );

            })}
          </div>
          <div className="column is-2" />
        </Fragment>
      );
    }
    return (
      <Fragment>
        <div className="column is-4">
          <h1 className="title"><Translate id="ongoingevents" /></h1>
          <div className="has-text-warning"><Translate id="noongoingeventstoday" /></div>
        </div>
        <div className="column is-2" />
      </Fragment>
    );
  }

  renderFutureEventItems(nextEvents) {
    if (!_.isEmpty(nextEvents)) {

      return (
        <Fragment>
          <div className="column is-2" />
          <div className="column is-4">
            <h1 className="title"><Translate id="nextevents" /></h1>
            <button className="button" onClick={() => this.switchView('today')}><Translate id="showeventstoday" /></button>
            {nextEvents.map((eventEntry) => {
              const eventId = eventEntry.key;
              return (
                <div key={eventId} className="columns today-view-cards-space">
                  <EventCard
                    eventId={eventId}
                    openModal={() => this.openModal(eventId)}
                  />
                </div>
              );

            })}
            <div><Translate id="toseeeventsfurtherinthefuturegotoeventspage" /></div>

          </div>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <div className="column is-2" />
        <div className="column is-4">
          <h1 className="title"><Translate id="nextevents" /></h1>
          <div className="has-text-warning"><Translate id="noeventsinnextsevendays" /></div>
          <p>&nbsp;</p>
          <div><Translate id="toseeeventsfurtherinthefuturegotoeventspage" /></div>
          <p>&nbsp;</p>
          <button className="button" onClick={() => this.switchView('today')}><Translate id="showeventstoday" /></button>

        </div>
      </Fragment>
    );

  }

  renderFutureOngoingEventItems(nextOngoingEvents) {
    if (!_.isEmpty(nextOngoingEvents)) {

      return (
        <Fragment>
          <div className="column is-4">
            <h1 className="title"><Translate id="ongoingnext7days" /></h1>
            {nextOngoingEvents.map((eventEntry) => {
              const eventId = eventEntry.key;
              return (
                <div key={eventId} className="columns today-view-cards-space">
                  <EventCard
                    eventId={eventId}
                    openModal={() => this.openModal(eventId)}
                  />
                </div>
              );
            })}
          </div>
          <div className="column is-2" />
        </Fragment>
      );
    }
    return (
      <Fragment>
        <div className="column is-4">
          <h1 className="title"><Translate id="nextevents" /></h1>
          <div className="has-text-warning"><Translate id="noeventsinnextsevendays" /></div>
          <p>&nbsp;</p>
          <div><Translate id="toseeeventsfurtherinthefuturegotoeventspage" /></div>
          <p>&nbsp;</p>
          <button className="button" onClick={() => this.switchView('today')}><Translate id="showeventstoday" /></button>
        </div>
        <div className="column is-2" />

      </Fragment>
    );

  }

  render() {

    const {
      events, eventsongoing, categories, uploadedCategoryLogos, activeLanguage,
    } = this.props;

    const { shownItems } = this.state;
    moment.locale(activeLanguage);

    if (isLoaded(events) && isLoaded(eventsongoing) && isLoaded(eventsongoing) && isLoaded(categories) && isLoaded(uploadedCategoryLogos)) {
      const nextEvents = shownItems === 'future' ? this.findNextEvents(events) : [];
      const nextOngoingEvents = shownItems === 'future' ? this.findNextOngoingEvents(eventsongoing) : [];

      const todaysEvents = shownItems === 'today' ? this.findTodaysEvents(events) : [];
      const todaysOngoingEvents = shownItems === 'today' ? this.findTodaysOngoingEvents(eventsongoing) : [];

      return (
        <div className="section">
          <div className="columns is-multiline">

            {isLoaded(events) && todaysEvents.map(eventEntry => this.renderEventModal(eventEntry))}
            {isLoaded(events) && nextEvents.map(eventEntry => this.renderEventModal(eventEntry))}

            {shownItems === 'today' && this.renderTodaysEventItems(todaysEvents)}
            {shownItems === 'today' && this.renderTodaysOngoingEventItems(todaysOngoingEvents)}
            {shownItems === 'future' && this.renderFutureEventItems(nextEvents)}
            {shownItems === 'future' && this.renderFutureOngoingEventItems(nextOngoingEvents)}

            <div className="column is-2" />
            <div className="column is-8">
              <News />
            </div>
            <div className="column is-2" />
          </div>
        </div>);
    }
    return (
      <div />
    );

  }
}

Today.propTypes = {
  events: PropTypes.array,
  eventsongoing: PropTypes.array,
  categories: PropTypes.object,
  uploadedCategoryLogos: PropTypes.object,
  profile: PropTypes.object,
  activeLanguage: PropTypes.string,
};
