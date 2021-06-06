import React, { Component } from "react";
import { isLoaded, isEmpty } from "react-redux-firebase";
{
  /* import { Translate, Language } from "react-localize-redux"; */
}
import _ from "lodash";
import { FormattedMessage } from "react-intl";
import SingleEventParticipation from "./SingleEventParticipation-container";
import { User, Participation } from "../../../models/ReduxState";
import { TourmericEvent } from "../../../models/Events";
import { Category } from "../../../models/Category";
import { parse, addMonths, subMonths, isSameMonth, format } from "date-fns";

interface Props {
  users: [{ key: string; value: User }];
  categories: { [key: string]: Category };
  participations: { [key: string]: Participation };
  events: [{ key: string; value: TourmericEvent }];
  // activeLanguage: Language;
}

interface State {
  chosenMonth: Date;
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

  state = { chosenMonth: new Date() };

  toggleParticipantVisibility() {
    this.setState((prevState: Partial<State>) => ({
      participantsHidden: !prevState.participantsHidden,
    }));
  }

  forwardMonth() {
    this.setState((prevState: Partial<State>) => ({
      chosenMonth: addMonths(prevState.chosenMonth!, 1),
    }));
  }

  backMonth() {
    this.setState((prevState: Partial<State>) => ({
      chosenMonth: subMonths(prevState.chosenMonth!, 1),
    }));
  }

  render() {
    const { users, categories, participations, events } = this.props;

    const { chosenMonth } = this.state;

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
          const occursThisMonth = isSameMonth(
            chosenMonth,
            parse(eventDate, "yyyy-MM-dd", new Date())
          );
          return occursThisMonth;
        });

      return (
        <div>
          <div className="columns is-multiline">
            <div className="column is-6">
              <h1 className="title">
                {_.capitalize(format(chosenMonth, "MMMM, yyyy"))}
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
            <FormattedMessage id="youmusthaveeventsbeforeparticipationscanhappen" />
            .
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
