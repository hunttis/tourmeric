import React from "react";
import _ from "lodash";
import { Translate, Language } from "react-localize-redux";
import ClipboardJS from "clipboard";
import { isLoaded } from "react-redux-firebase";
{
  /* import moment from 'moment/min/moment-with-locales'; */
}

import { TourmericEvent } from "../../../models/Events";
import { Participation, User } from "../../../models/ReduxState";
import { Settings } from "../../../models/Settings";

interface URLQuery {
  params: { [key: string]: string };
}

interface Props {
  match: URLQuery;
  events: { [key: string]: TourmericEvent };
  eventsongoing: { [key: string]: TourmericEvent };
  settings: Settings;
  participations: { [key: string]: Participation };
  activeLanguage: Language;
  isAdmin: boolean;
  users: { [key: string]: User };
}

export const EventPlayerList = ({
  match,
  events,
  eventsongoing,
  settings,
  participations,
  activeLanguage,
  users,
}: Props) => {
  if (!isLoaded(events)) {
    return (
      <div className="section has-text-centered">
        <div className="button is-loading">
          <Translate id="loading" />
        </div>
      </div>
    );
  }

  moment.locale(activeLanguage.code);

  const eventId = match.params.id;
  let eventContent = _.get(events, eventId, null);
  let singleDay = true;
  if (!eventContent) {
    eventContent = _.get(eventsongoing, eventId, null)!;
    singleDay = false;
  }

  if (!eventContent) {
    if (isLoaded(events)) {
      return (
        <div className="section has-text-centered">
          <div className="button is-loading">
            <Translate id="noevent" />
          </div>
        </div>
      );
    }
  }

  if (!isLoaded(participations)) {
    return (
      <div className="section has-text-centered">
        <div className="button is-loading" />
      </div>
    );
  }

  const dateFormat = _.get(settings, "dateFormat", "DD.MM.YYYY");
  const formattedDateWithDayName = singleDay
    ? moment(eventContent.date, "YYYY-MM-DD").format(`${dateFormat} (dddd)`)
    : `${moment(eventContent.date, "YYYY-MM-DD").format(
        `${dateFormat} (dddd)`
      )} - ${moment(eventContent.endDate, "YYYY-MM-DD").format(
        `${dateFormat} (dddd)`
      )}`;

  let participationsForEvent = Object.values(
    _.get(participations, eventId, [])
  );
  participationsForEvent = _.sortBy(participationsForEvent, ["date"]);
  const participationsSortedByLastname = _.sortBy(participationsForEvent, [
    "lastName",
  ]);

  new ClipboardJS("#sharebutton"); // eslint-disable-line

  return (
    <div>
      <div className="section has-background-white">
        <h1 className="title has-text-black">
          {eventContent.name} - {formattedDateWithDayName}
        </h1>
        <div className="columns is-multiline is-fullwidth">
          <div className="column is-12">
            <table className="table is-narrow is-family-monospace has-background-white has-text-black">
              <thead>
                <tr className="">
                  <th />
                  <th>
                    <h2 className="subtitle">
                      <Translate id="lastname" />
                    </h2>
                  </th>
                  <th>
                    <h2 className="subtitle">
                      <Translate id="firstname" />
                    </h2>
                  </th>
                  <th>
                    <h2 className="subtitle">
                      <Translate id="dcinumber" />
                    </h2>
                  </th>
                </tr>
              </thead>
              <tbody>
                {participationsSortedByLastname.map((participation, index) => {
                  const dciNumber = _.get(
                    users,
                    `${participation.userId}.dciNumber`,
                    "-"
                  );
                  return (
                    <tr key={`participation-${index}`}>
                      <td>{index + 1}.</td>
                      <td>{participation.lastName}</td>
                      <td>{participation.firstName}</td>
                      <td>{dciNumber}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
