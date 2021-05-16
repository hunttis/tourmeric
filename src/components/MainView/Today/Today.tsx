import React, { Component } from "react";
import { isLoaded } from "react-redux-firebase";
import { Translate, Language } from "react-localize-redux";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import News from "./News-container";
import EventCard from "../../EventList/EventCard/EventCard-container";
import { TourmericEvent } from "../../../models/Events";
import { Category, UploadedFile } from "../../../models/Category";
import { FirebaseProfile } from "../../../models/ReduxState";
import { addDays, isSameDay, format } from "date-fns";
import { fi, enGB } from "date-fns/locale";

import {
  getEventsForDay,
  getOngoingEventsForDay,
} from "../../../components/Common/EventUtils";
import { Settings } from "../../../models/Settings";

interface Props {
  events: { key: string; value: TourmericEvent }[];
  eventsongoing: { key: string; value: TourmericEvent }[];
  categories: { [key: string]: Category };
  uploadedCategoryLogos: { [key: string]: UploadedFile };
  profile: FirebaseProfile;
  settings: Settings;
  activeLanguage: Language;
}

interface State {
  showingDay: Date;
}

export default class Today extends Component<Props, State> {
  state = { showingDay: new Date() };

  changeShowingDay(changeAmount: number) {
    const currentDay: Date = this.state.showingDay;
    const newDay = addDays(currentDay, changeAmount);
    this.setState({ showingDay: newDay });
  }

  resetShowingDay() {
    this.setState({ showingDay: new Date() });
  }

  render() {
    const {
      events,
      eventsongoing,
      categories,
      uploadedCategoryLogos,
      activeLanguage,
      settings,
    } = this.props;

    const { showingDay } = this.state;

    if (activeLanguage) {
      // TODO Does this need replacement?
      {
        /* moment.locale(activeLanguage.code); */
      }
    }

    if (
      isLoaded(events) &&
      isLoaded(eventsongoing) &&
      isLoaded(categories) &&
      isLoaded(uploadedCategoryLogos) &&
      isLoaded(settings)
    ) {
      const allEventsForDay = _.concat(
        getEventsForDay(showingDay),
        getOngoingEventsForDay(showingDay)
      );
      const sortedEvents = _.sortBy(allEventsForDay, (event) =>
        _.padStart(event.value.time, 5, "0")
      );

      const eventsToDisplay = !_.isEmpty(allEventsForDay);
      const showingToday = isSameDay(showingDay, new Date());

      return (
        <div className="section">
          <div className="columns is-multiline">
            <div className="column is-2" />
            <div className="column is-4">
              <div className="level">
                <div className="level-left">
                  <h1 className="title">
                    <FormattedMessage id="events" />
                  </h1>
                </div>
                <div className="level-right">
                  <button
                    className="button is-sm"
                    onClick={() => this.changeShowingDay(-1)}
                  >
                    <span className="icon">
                      <i className="fas fa-arrow-left" />
                    </span>
                  </button>
                  <button
                    className="button is-sm"
                    onClick={() => this.resetShowingDay()}
                    disabled={showingToday}
                  >
                    <span className="icon">
                      <i className="fas fa-dot-circle" />
                    </span>
                  </button>
                  <button
                    className="button is-sm"
                    onClick={() => this.changeShowingDay(1)}
                  >
                    <span className="icon">
                      <i className="fas fa-arrow-right" />
                    </span>
                  </button>
                </div>
              </div>
              <h2 className="subtitle">
                {format(showingDay, settings.dateFormat)}
              </h2>
              {sortedEvents.map((eventEntry) => (
                <div
                  key={eventEntry.key}
                  className="columns today-view-cards-space"
                >
                  <EventCard eventId={eventEntry.key} />
                </div>
              ))}
              {!eventsToDisplay && (
                <div className="has-text-warning">
                  <FormattedMessage id="noevents" />
                </div>
              )}
            </div>
            <div className="column is-4">
              <News />
            </div>
            <div className="column is-2" />
          </div>
        </div>
      );
    }
    return <div />;
  }
}
