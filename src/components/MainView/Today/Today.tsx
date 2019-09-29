import React, { Component } from 'react';
import moment from 'moment/min/moment-with-locales';
import { isLoaded } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import News from './News-container';
import EventCard from '../../EventList/EventCard/EventCard-container';
import { TourmericEvent } from '~/models/Events';
import { Category, UploadedFile } from '~/models/Category';
import { FirebaseProfile } from '~/models/ReduxState';
import { createMomentFromDateString, createCurrentMoment } from '~/components/Common/Utils';
import { doDateRangesOverlap } from '~/components/Common/TimeUtils';

interface Props {
  events: { key: string, value: TourmericEvent }[];
  eventsongoing: { key: string, value: TourmericEvent }[];
  categories: { [key: string]: Category };
  uploadedCategoryLogos: { [key: string]: UploadedFile };
  profile: FirebaseProfile;
  activeLanguage: string;
}

interface State {
  shownItems: string;
  showPastEventsFilter: boolean;
}

export default class Today extends Component<Props, Partial<State>> {

  state = { shownItems: 'today', showPastEventsFilter: false }

  findNextEvents(events: { key: string, value: TourmericEvent }[]) {
    const { profile } = this.props;
    const now = moment();
    const after7Days = moment().add(7, 'days');
    const hasDefinedFavorites = !_.isEmpty(profile.favoriteCategories) && !_.isEmpty(profile.favoriteCategories!.trim());
    if (events) {
      const nextEvents = events.filter((eventEntry) => {
        const eventData = eventEntry.value;
        const eventDate = moment(eventData.date, 'YYYY-MM-DD');
        const isWithinAWeek = eventDate.isAfter(now, 'day') && eventDate.isBefore(after7Days, 'day');
        const isFavorite = !hasDefinedFavorites || profile.favoriteCategories!.indexOf(eventData.category) !== -1;
        return eventData.published && isWithinAWeek && isFavorite;
      });
      return nextEvents;
    }
    return [];
  }

  findNextOngoingEvents(ongoingevents: { key: string, value: TourmericEvent }[]) {
    const { profile } = this.props;
    const hasDefinedFavorites = !_.isEmpty(profile.favoriteCategories) && !_.isEmpty(profile.favoriteCategories!.trim());
    if (ongoingevents) {
      const nextEvents = ongoingevents.filter((eventEntry) => {
        const eventData = eventEntry.value;
        const isWithinAWeek = doDateRangesOverlap(moment(), moment().add(7, 'days'), createMomentFromDateString(eventData.date), createMomentFromDateString(eventData.endDate!));
        const isFavorite = !hasDefinedFavorites || profile.favoriteCategories!.indexOf(eventData.category) !== -1;
        return eventData.published && isWithinAWeek && isFavorite;
      });
      return nextEvents;
    }
    return [];
  }

  findTodaysEvents(events: { key: string, value: TourmericEvent }[]) {
    const { profile } = this.props;
    const hasDefinedFavorites = !_.isEmpty(profile.favoriteCategories) && !_.isEmpty(profile.favoriteCategories!.trim());
    if (events) {

      const todaysEvents = events.filter((eventEntry) => {
        const eventData = eventEntry.value;
        const isFavorite = !hasDefinedFavorites || profile.favoriteCategories!.indexOf(eventData.category) !== -1;

        if (eventData.published && createMomentFromDateString(eventData.date).isSame(createCurrentMoment(), 'day') && isFavorite) {
          return true;
        }
        return false;
      });
      return todaysEvents;
    }
    return [];
  }

  findTodaysOngoingEvents(eventsongoing: { key: string, value: TourmericEvent }[]) {
    const { profile } = this.props;
    const hasDefinedFavorites = !_.isEmpty(profile.favoriteCategories) && !_.isEmpty(profile.favoriteCategories!.trim());
    if (eventsongoing) {
      const todaysOngoingEvents = eventsongoing.filter((eventEntry) => {
        const eventData = eventEntry.value;
        const isFavorite = !hasDefinedFavorites || profile.favoriteCategories!.indexOf(eventData.category) !== -1;

        if (eventData.endDate) {
          return isFavorite && createCurrentMoment().isBetween(createMomentFromDateString(eventData.date), createMomentFromDateString(eventData.endDate), 'day', '[]');
        }
        return false;

      });
      return todaysOngoingEvents;
    }
    return [];
  }

  togglePastEventFilter() {
    const { showPastEventsFilter } = this.state;
    this.setState({ showPastEventsFilter: !showPastEventsFilter });
  }

  modalItem(translationKey: string, content: string) {
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


  switchView(newView: string) {
    this.setState({ shownItems: newView });
  }

  renderTodaysEventItems(todaysEvents: { key: string, value: TourmericEvent }[]) {
    if (!_.isEmpty(todaysEvents)) {
      return (
        <>
          <div className="column is-2" />
          <div className="column is-4">
            <h1 className="title"><Translate id="todaysevents" /></h1>
            {todaysEvents.map((eventEntry) => {
              const eventId = eventEntry.key;

              return (
                <div key={eventId} className="columns today-view-cards-space">
                  <EventCard
                    eventId={eventId}
                  />
                </div>
              );

            })}
          </div>
        </>
      );
    }
    return (
      <>
        <div className="column is-2" />
        <div className="column is-4">
          <h1 className="title"><Translate id="todaysevents" /></h1>
          <div className="has-text-warning"><Translate id="noeventstoday" /></div>
          <p>&nbsp;</p>
          <button className="button" onClick={() => this.switchView('future')}><Translate id="shownext7days" /></button>
        </div>
      </>
    );
  }

  renderTodaysOngoingEventItems(eventsongoing: { key: string, value: TourmericEvent }[]) {
    if (!_.isEmpty(eventsongoing)) {
      return (
        <>
          <div className="column is-4">
            <h1 className="title"><Translate id="ongoingevents" /></h1>
            {eventsongoing.map((eventEntry) => {
              const eventId = eventEntry.key;

              return (
                <div key={eventId} className="columns today-view-cards-space">
                  <EventCard
                    eventId={eventId}
                    // openModal={() => this.openModal(eventId)}
                  />
                </div>
              );

            })}
          </div>
          <div className="column is-2" />
        </>
      );
    }
    return (
      <>
        <div className="column is-4">
          <h1 className="title"><Translate id="ongoingevents" /></h1>
          <div className="has-text-warning"><Translate id="noongoingeventstoday" /></div>
        </div>
        <div className="column is-2" />
      </>
    );
  }

  renderFutureEventItems(nextEvents: { key: string, value: TourmericEvent }[]) {
    if (!_.isEmpty(nextEvents)) {

      return (
        <>
          <div className="column is-2" />
          <div className="column is-4">
            <h1 className="title"><Translate id="nextevents" /></h1>
            <button className="button" onClick={() => this.switchView('today')}><Translate id="showeventstoday" /></button>
            {nextEvents.map((eventEntry) => {
              const eventId = eventEntry.key;
              return (
                <div key={eventId} className="columns today-view-cards-space">
                  <EventCard eventId={eventId} />
                </div>
              );

            })}
            <div><Translate id="toseeeventsfurtherinthefuturegotoeventspage" /></div>

          </div>
        </>
      );
    }
    return (
      <>
        <div className="column is-2" />
        <div className="column is-4">
          <h1 className="title"><Translate id="nextevents" /></h1>
          <div className="has-text-warning"><Translate id="noeventsinnextsevendays" /></div>
          <p>&nbsp;</p>
          <div><Translate id="toseeeventsfurtherinthefuturegotoeventspage" /></div>
          <p>&nbsp;</p>
          <button className="button" onClick={() => this.switchView('today')}><Translate id="showeventstoday" /></button>

        </div>
      </>
    );

  }

  renderFutureOngoingEventItems(nextOngoingEvents: { key: string, value: TourmericEvent }[]) {
    if (!_.isEmpty(nextOngoingEvents)) {

      return (
        <>
          <div className="column is-4">
            <h1 className="title"><Translate id="ongoingnext7days" /></h1>
            {nextOngoingEvents.map((eventEntry) => {
              const eventId = eventEntry.key;
              return (
                <div key={eventId} className="columns today-view-cards-space">
                  <EventCard eventId={eventId} />
                </div>
              );
            })}
          </div>
          <div className="column is-2" />
        </>
      );
    }
    return (
      <>
        <div className="column is-4">
          <h1 className="title"><Translate id="nextevents" /></h1>
          <div className="has-text-warning"><Translate id="noeventsinnextsevendays" /></div>
          <p>&nbsp;</p>
          <div><Translate id="toseeeventsfurtherinthefuturegotoeventspage" /></div>
          <p>&nbsp;</p>
          <button className="button" onClick={() => this.switchView('today')}><Translate id="showeventstoday" /></button>
        </div>
        <div className="column is-2" />

      </>
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
