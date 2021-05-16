import React, { useState } from "react";
import _ from "lodash";
import firebase from "firebase/app";
import { Translate, Language } from "react-localize-redux";
import ClipboardJS from "clipboard";
import { isLoaded } from "react-redux-firebase";
{
  /* import moment from 'moment/min/moment-with-locales'; */
}
import { History } from "history";

import { ModalItem } from "../ModalItem";
import { ParticipantList } from "../ParticipantList";
import { checkParticipation } from "../../../api/eventApi";
import { CardFooterMobile } from "./CardFooterMobile";
import { CardFooterDesktop } from "./CardFooterDesktop";
import { TourmericEvent } from "../../../models/Events";
import {
  Participation,
  FirebaseAuth,
  ParticipationData,
} from "../../../models/ReduxState";
import { Settings } from "../../../models/Settings";
import { Category } from "../../../models/Category";
import AddPlaceHolderUser from "../../../components/AdminTools/EventEditor/AddPlaceHolderUser-container";

interface URLQuery {
  params: { [key: string]: string };
}

interface Props {
  match: URLQuery;
  events: { [key: string]: TourmericEvent };
  eventsongoing: { [key: string]: TourmericEvent };
  categories: { [key: string]: Category };
  settings: Settings;
  participations: { [key: string]: Participation };
  auth: FirebaseAuth;
  activeLanguage: Language;
  isAdmin: boolean;
  history: History;
}

export const SingleEvent = ({
  match,
  events,
  eventsongoing,
  categories,
  settings,
  participations,
  auth,
  activeLanguage,
  isAdmin,
  history,
}: Props) => {
  const [userToCancel, setUserToCancel] = useState<null | string>(null);

  if (!isLoaded(events)) {
    return (
      <div className="section has-text-centered">
        <div className="button is-loading">
          <FormattedMessage id="loading" />
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
            <FormattedMessage id="noevent" />
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

  const category = _.get(categories, eventContent.category, "");
  const dateFormat = _.get(settings, "dateFormat", "DD.MM.YYYY");
  const formattedDateWithDayName = singleDay
    ? moment(eventContent.date, "YYYY-MM-DD").format(`${dateFormat} (dddd)`)
    : `${moment(eventContent.date, "YYYY-MM-DD").format(
        `${dateFormat} (dddd)`
      )} - ${moment(eventContent.endDate, "YYYY-MM-DD").format(
        `${dateFormat} (dddd)`
      )}`;

  const formattedDateWithNoDayNamesInMultiDayEvent = singleDay
    ? moment(eventContent.date, "YYYY-MM-DD").format(`${dateFormat} (dddd)`)
    : `${moment(eventContent.date, "YYYY-MM-DD").format(
        `${dateFormat}`
      )} - ${moment(eventContent.endDate, "YYYY-MM-DD").format(
        `${dateFormat}`
      )}`;

  const userId = _.get(auth, "uid");
  const participationsMap: { [key: string]: ParticipationData } =
    participations[eventId];
  let participationsForEvent = Object.values(
    _.get(participations, eventId, [])
  );
  participationsForEvent = _.sortBy(participationsForEvent, ["date"]);
  const alreadyParticipated = checkParticipation(
    userId,
    eventId,
    participations
  );
  const thisParticipation = _.get(participations, `${eventId}.${userId}`, {});

  const participationBeingCancelledId: string =
    _.findKey(participationsMap, (p) => p.userId === userToCancel) || "";
  const participationBeingCancelled = participationBeingCancelledId
    ? participationsMap[participationBeingCancelledId]
    : null;

  new ClipboardJS("#sharebutton"); // eslint-disable-line

  const splitNotes = eventContent.notes
    ? eventContent.notes
        .split("\n")
        .filter((paragraph) => !_.isEmpty(paragraph))
    : [];
  const splitPrizes = eventContent.prizes
    ? eventContent.prizes
        .split("\n")
        .filter((paragraph) => !_.isEmpty(paragraph))
    : [];

  return (
    <div>
      <div className="section">
        <div className="level is-hidden-tablet">
          <div className="level-item" />
          {category && (
            <div className="level-item">
              <div className="image is-128x128 is-hidden-tablet">
                <img className="" alt="" src={category.image} />
              </div>
            </div>
          )}
          <div className="level-item" />
        </div>
        <p className="is-hidden-tablet">&nbsp;</p>

        <div className="card">
          <div className="card-header is-vcentered card-header-image-container">
            {category && (
              <img
                className="image is-hidden-mobile eventcard-header-image"
                alt=""
                src={category.image}
              />
            )}
          </div>
          <div className="card-header is-vcentered">
            <h1 className="card-header-title is-centered title has-text-success">
              {eventContent.name}
            </h1>
          </div>
          <div className="card-header is-vcentered">
            <h2 className="card-header-title is-centered subtitle has-text-info">
              <p>{formattedDateWithDayName}</p>
            </h2>
          </div>
          <div className="card-header is-vcentered">
            <h2 className="card-header-title is-centered subtitle has-text-info">
              <p>{eventContent.time && <>{eventContent.time}</>}</p>
            </h2>
          </div>

          <div className="card-content">
            <div className="columns">
              <div className="column is-6 columns is-multiline">
                <div className="column is-12">
                  <div className="subtitle has-text-info">
                    <FormattedMessage id="eventdetails" />
                  </div>
                </div>
                <div className="column is-1" />
                <div className="column is-11">
                  {eventContent.date && (
                    <>
                      <i className="fas fa-calendar" />
                      &nbsp;&nbsp;
                      {formattedDateWithNoDayNamesInMultiDayEvent}
                      <br />
                    </>
                  )}

                  {eventContent.time && (
                    <>
                      <i className="fas fa-clock" />
                      &nbsp;&nbsp;{eventContent.time}
                      <br />
                    </>
                  )}

                  {eventContent.format && (
                    <>
                      <i className="fas fa-book" />
                      &nbsp;&nbsp;{eventContent.format}
                      <br />
                    </>
                  )}

                  {eventContent.rulesLevel && (
                    <>
                      <i className="fas fa-balance-scale" />
                      &nbsp;&nbsp;{eventContent.rulesLevel}
                      <br />
                    </>
                  )}

                  {eventContent.entryFee && (
                    <>
                      <i className="fas fa-money-bill-alt" />
                      &nbsp;&nbsp;{eventContent.entryFee}
                      <br />
                    </>
                  )}
                </div>

                {eventContent.notes && (
                  <ModalItem translationKey="notes" contentArray={splitNotes} />
                )}
                {eventContent.prizes && (
                  <ModalItem
                    translationKey="prizes"
                    contentArray={splitPrizes}
                  />
                )}

                {eventContent.link && (
                  <>
                    <div className="column is-12">
                      <div className="subtitle has-text-info">
                        <FormattedMessage id="link" />
                      </div>
                    </div>

                    <div className="column is-1" />
                    <div className="column is-11">
                      <p>
                        <a
                          href={eventContent.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {eventContent.link}
                        </a>
                      </p>
                    </div>
                  </>
                )}
                <div className="column is-12">
                  <button
                    id="sharebutton"
                    className="button is-primary"
                    data-clipboard-text={`${window.location.href}`}
                  >
                    <i className="fas fa-copy" />
                    &nbsp;&nbsp;
                    <FormattedMessage id="copylinktoevent" />
                  </button>
                </div>
              </div>
              <div className="column is-6">
                {isLoaded(events) && (
                  <>
                    <div className="subtitle has-text-info">
                      <FormattedMessage id="participants" />
                      &nbsp;
                      {!eventContent.playerSlots && (
                        <>({participationsForEvent.length})</>
                      )}
                      {eventContent.playerSlots && (
                        <>
                          ({participationsForEvent.length} /{" "}
                          {eventContent.playerSlots})
                        </>
                      )}
                    </div>
                  </>
                )}
                {!isLoaded(events) && (
                  <div className="button is-loading">Loading</div>
                )}
                {isLoaded(participations) && _.isEmpty(participations) && (
                  <div>
                    <FormattedMessage id="noparticipants" />
                  </div>
                )}
                {!_.isEmpty(participations) && (
                  <>
                    <div className="column is-1" />
                    <div className="column is-11">
                      <ParticipantList
                        participations={participationsForEvent}
                        maxParticipants={parseInt(
                          _.get(eventContent, "playerSlots", "0"),
                          10
                        )}
                        isAdmin={isAdmin}
                        userToCancel={userToCancel}
                        setUserToCancel={setUserToCancel}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <CardFooterDesktop
            alreadyParticipated={alreadyParticipated}
            thisParticipation={thisParticipation}
            eventId={eventId}
            userId={userId}
          />

          <CardFooterMobile
            alreadyParticipated={alreadyParticipated}
            thisParticipation={thisParticipation}
            eventId={eventId}
            userId={userId}
          />

          {isAdmin && (
            <>
              <div className="card-footer has-background-black">
                <div className="card-footer-item has-text-warning">
                  <span className="icon">
                    <i className="fas fa-arrow-down" />
                  </span>{" "}
                  ADMIN{" "}
                  <span className="icon">
                    <i className="fas fa-arrow-down" />
                  </span>
                </div>
              </div>
              <div className="card-footer">
                <div className="card-footer-item event-card-footer">
                  <AddPlaceHolderUser eventId={match.params.id} />
                </div>
                <div className="card-footer-item event-card-footer">
                  {userToCancel && participationBeingCancelled && (
                    <div>
                      <h2 className="subtitle has-text-danger has-text-centered">
                        <FormattedMessage id="confirmparticipationcancellation" />
                      </h2>

                      <p className="has-text-centered">
                        <FormattedMessage id="areyousureyouwanttocancelparticipationforuser" />{" "}
                        <span className="has-text-info">
                          {participationBeingCancelled.firstName}{" "}
                          {participationBeingCancelled.lastName}
                        </span>
                        ?
                      </p>
                      <p className="has-text-centered">
                        <FormattedMessage id="thisactioncannotbereversed" />
                      </p>
                      <p>&nbsp;</p>
                      <div className="level">
                        <div className="level-item">
                          <button
                            className="button is-danger is-outlined is-small"
                            onClick={() =>
                              firebase.set(
                                `/participations/${eventId}/${participationBeingCancelled.userId}`,
                                {}
                              )
                            }
                          >
                            <FormattedMessage id="yes" />
                          </button>
                        </div>
                        <div className="level-item">
                          <button
                            className="button is-info is-outlined is-small"
                            onClick={() => setUserToCancel(null)}
                          >
                            <FormattedMessage id="no" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <div className="card-footer-item event-card-footer">
                  <button
                    className="button is-outlined is-success"
                    onClick={() =>
                      history.push(`/event/${eventId}/printplayerlist`)
                    }
                  >
                    <FormattedMessage id="showplayerlist" />
                  </button>
                </div>
                <div className="card-footer-item event-card-footer" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
