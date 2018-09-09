import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { isLoaded } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import News from './News-container';
import EventCard from '../../EventList/EventCard-container';
import EventModal from '../../EventList/EventModal-container';

export default class Today extends Component {

  state = { shownItems: 'today', modalOpenEventId: null }

  findNextEvents(events) {
    const { profile } = this.props;
    const now = moment();
    const after7Days = moment().add(7, 'days');
    const hasDefinedFavorites = !_.isEmpty(profile.favoriteCategories);
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

  findTodaysEvents(events) {
    if (events) {

      const todaysEvents = events.filter((eventEntry) => {
        const eventData = eventEntry.value;
        if (eventData.published && moment(eventData.date, 'YYYY-MM-DD').isSame(moment(), 'day')) {
          return true;
        }
        return false;
      });
      return todaysEvents;
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
          <div className="column is-6">
            <h1 className="title"><Translate id="todaysevents" /></h1>
            <button className="button" onClick={() => this.switchView('future')}><Translate id="shownext7days" /></button>
            {todaysEvents.map((eventEntry) => {
              const eventId = eventEntry.key;

              return (
                <div key={eventId} className="columns">
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
        <div className="column is-6">
          <h1 className="title"><Translate id="todaysevents" /></h1>
          <div className="has-text-warning"><Translate id="noeventstoday" /></div>
          <p>&nbsp;</p>
          <button className="button" onClick={() => this.switchView('future')}><Translate id="shownext7days" /></button>
        </div>
      </Fragment>
    );
  }

  renderFutureEventItems(nextEvents) {
    if (!_.isEmpty(nextEvents)) {

      return (
        <Fragment>
          <div className="column is-6">
            <h1 className="title"><Translate id="nextevents" /></h1>
            <button className="button" onClick={() => this.switchView('today')}><Translate id="showeventstoday" /></button>
            {nextEvents.map((eventEntry) => {
              const eventId = eventEntry.key;
              return (
                <div key={eventId} className="columns">
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
        <div className="column is-6">
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

  render() {

    const {
      events, categories, uploadedCategoryLogos,
    } = this.props;

    const { shownItems } = this.state;

    if (isLoaded(events) && isLoaded(categories) && isLoaded(uploadedCategoryLogos)) {
      const nextEvents = this.findNextEvents(events);
      const todaysEvents = this.findTodaysEvents(events);

      return (
        <div className="section">
          <div className="columns is-multiline">

            {isLoaded(events) && todaysEvents.map(eventEntry => this.renderEventModal(eventEntry))}

            {isLoaded(events) && nextEvents.map(eventEntry => this.renderEventModal(eventEntry))}


            {/* <pre>{JSON.stringify(todaysEvents)}</pre> */}

            {shownItems === 'today' &&
              this.renderTodaysEventItems(todaysEvents)
            }

            {shownItems === 'future' &&
              this.renderFutureEventItems(nextEvents)
            }

            <div className="column is-6">
              <News />
            </div>
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
  categories: PropTypes.object,
  uploadedCategoryLogos: PropTypes.object,
  profile: PropTypes.object,
};
