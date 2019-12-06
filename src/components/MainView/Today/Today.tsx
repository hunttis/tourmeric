import React, { Component } from 'react';
import moment from 'moment/min/moment-with-locales';
import { isLoaded } from 'react-redux-firebase';
import { Translate, Language } from 'react-localize-redux';
import _ from 'lodash';
import News from './News-container';
import EventCard from '../../EventList/EventCard/EventCard-container';
import { TourmericEvent } from '~/models/Events';
import { Category, UploadedFile } from '~/models/Category';
import { FirebaseProfile } from '~/models/ReduxState';

import { getEventsForDay, getOngoingEventsForDay } from '~/components/Common/EventUtils';
import { Settings } from '~/models/Settings';

interface Props {
  events: { key: string, value: TourmericEvent }[];
  eventsongoing: { key: string, value: TourmericEvent }[];
  categories: { [key: string]: Category };
  uploadedCategoryLogos: { [key: string]: UploadedFile };
  profile: FirebaseProfile;
  settings: Settings;
  activeLanguage: Language;
}

interface State {
  showingDay: moment.Moment;
}

export default class Today extends Component<Props, State> {

  state = { showingDay: moment() }

  changeShowingDay(changeAmount: number) {
    const currentDay: moment.Moment = this.state.showingDay;
    const newDay = currentDay.add(changeAmount, 'days');
    this.setState({ showingDay: newDay });
  }

  resetShowingDay() {
    this.setState({ showingDay: moment() });
  }

  render() {

    const {
      events, eventsongoing, categories, uploadedCategoryLogos, activeLanguage, settings,
    } = this.props;

    const { showingDay } = this.state;
    moment.locale(activeLanguage.code);

    if (isLoaded(events) && isLoaded(eventsongoing) && isLoaded(categories) && isLoaded(uploadedCategoryLogos) && isLoaded(settings)) {

      const allEventsForDay = _.concat(getEventsForDay(showingDay), getOngoingEventsForDay(showingDay));
      const sortedEvents = _.sortBy(allEventsForDay, (event) => _.padStart(event.value.time, 5, '0'));

      const eventsToDisplay = !_.isEmpty(allEventsForDay);
      const showingToday = showingDay.isSame(moment(), 'day');

      return (
        <div className="section">
          <div className="columns is-multiline">
            <div className="column is-2" />
            <div className="column is-4">
              <div className="level">
                <div className="level-left">
                  <h1 className="title">
                    <Translate id="events" />
                  </h1>
                </div>
                <div className="level-right">
                  <button className="button is-sm" onClick={() => this.changeShowingDay(-1)}><span className="icon"><i className="fas fa-arrow-left" /></span></button>
                  <button className="button is-sm" onClick={() => this.resetShowingDay()} disabled={showingToday}><span className="icon"><i className="fas fa-dot-circle" /></span></button>
                  <button className="button is-sm" onClick={() => this.changeShowingDay(1)}><span className="icon"><i className="fas fa-arrow-right" /></span></button>
                </div>
              </div>
              <h2 className="subtitle">{showingDay.format(settings.dateFormat)}</h2>
              {sortedEvents.map((eventEntry) => (
                <div key={eventEntry.key} className="columns today-view-cards-space">
                  <EventCard eventId={eventEntry.key} />
                </div>
              ))}
              {!eventsToDisplay && <div className="has-text-warning"><Translate id="noevents" /></div>}
            </div>
            <div className="column is-4">
              <News />
            </div>
            <div className="column is-2" />
          </div>
        </div>
      );
    }
    return (
      <div />
    );
  }
}
