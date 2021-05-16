import React, { Component } from "react";
import { isLoaded, isEmpty } from "react-redux-firebase";
import { Translate, Language } from "react-localize-redux";
import _ from "lodash";
import SingleEventParticipation from "./SingleEventParticipation-container";
import { User, Participation } from "../../../models/ReduxState";
import { TourmericEvent } from "../../../models/Events";
import { Category } from "../../../models/Category";

interface Props {
  users: [{ key: string; value: User }];
  categories: { [key: string]: Category };
  participations: { [key: string]: Participation };
  events: [{ key: string; value: TourmericEvent }];
  activeLanguage: Language;
}

interface State {
  chosenMonth: DateTime;
  participantsHidden: boolean;
}

export default class ParticipationEditor extends Component<
  Props,
  Partial<State>
> {
  constructor(props: Props) {
    super(props);
    this.toggleParticipantVisibility = this.toggleParticipantVisibility.bind(
      this
    );
  }

  state = { chosenMonth: luxon.DateTime.now() };

  toggleParticipantVisibility() {
    this.setState((prevState: Partial<State>) => ({
      participantsHidden: !prevState.participantsHidden,
    }));
  }

  forwardMonth() {
    this.setState((prevState: Partial<State>) => ({
      chosenMonth: prevState.chosenMonth!.plus({ months: 1 }),
    }));
  }

  backMonth() {
    this.setState((prevState: Partial<State>) => ({
      chosenMonth: prevState.chosenMonth!.minus({ months: 1 }),
    }));
  }

  render() {
    const {
      users,
      categories,
      participations,
      events,
      activeLanguage,
    } = this.props;

    const { chosenMonth } = this.state;

    chosenMonth.setLocale(activeLanguage.code);

    if (
      isLoaded(events) &&
      !isEmpty(events) &&
      isLoaded(categories) &&
      isLoaded(participations) &&
      isLoaded(users)
    ) {
      const publishedEvents = Object.values(events)
        .filter((event) => event.value.published)
        .filter((event) => {
          const eventDate = event.value.date;
          const occursThisMonth = chosenMonth.hasSame(
            luxon.DateTime.fromFormat(eventDate, "YYYY-MM-DD"),
            "month"
          );
          return occursThisMonth;
        });

      return (
        <div>
          <div className="columns is-multiline">
            <div className="column is-6">
              <h1 className="title">
                {_.capitalize(chosenMonth.toFormat("MMMM, YYYY"))}
              </h1>
            </div>
            <div className="column is-6">
              <div className="buttons has-addons is-right">
                <button
                  className="button"
                  onClick={() => {
                    this.backMonth();
                  }}
                >
                  <FormattedMessage id="previousmonth" />
                </button>
                <button
                  className="button"
                  onClick={() => {
                    this.forwardMonth();
                  }}
                >
                  <FormattedMessage id="nextmonth" />
                </button>
              </div>
            </div>

            {publishedEvents.map((eventEntry, index) => {
              const eventId = eventEntry.key;
              const event = eventEntry.value;
              return (
                <SingleEventParticipation
                  key={`singleevent-${index}`}
                  event={event}
                  eventId={eventId}
                />
              );
            })}
          </div>
        </div>
      );
    }
    if (isLoaded(events) && isLoaded(participations)) {
      if (isEmpty(events)) {
        return (
          <div>
            <FormattedMessage id="noevents" />.{" "}
            <FormattedMessage id="youmusthaveeventsbeforeparticipationscanhappen" />.
          </div>
        );
      }
    }

    return (
      <div>
        <FormattedMessage id="loading" />
      </div>
    );
  }
}
