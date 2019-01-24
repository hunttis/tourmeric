import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import ClipboardJS from 'clipboard';
import { isLoaded } from 'react-redux-firebase';
import moment from 'moment/min/moment-with-locales';

import { ModalItem } from '../ModalItem';
import { ParticipantList } from '../ParticipantList';
import { checkParticipation } from '../../../api/eventApi';
import { CardFooterMobile } from './CardFooterMobile';
import { CardFooterDesktop } from './CardFooterDesktop';

export const SingleEvent = ({ match, events, categories, settings, participations, auth, activeLanguage }) => {

  moment.locale(activeLanguage);

  const eventId = match.params.id;
  const eventContent = _.get(events, eventId, {});
  const category = _.get(categories, eventContent.category, '');
  const dateFormat = _.get(settings, 'dateFormat', 'DD.MM.YYYY');
  const formattedDateWithDayName = moment(eventContent.date, 'YYYY-MM-DD').format(`${dateFormat} (dddd)`);

  const userId = _.get(auth, 'uid');
  let participationsForEvent = Object.values(_.get(participations, eventId, []));
  participationsForEvent = _.sortBy(participationsForEvent, ['date']);
  const alreadyParticipated = checkParticipation(userId, eventId, participations);
  const thisParticipation = _.get(participations, `${eventId}.${userId}`, {});

  new ClipboardJS('#sharebutton'); // eslint-disable-line


  if (!isLoaded(events)) {
    return (
      <div className="section has-text-centered">
        <div className="button is-loading">Loading</div>
      </div>
    );
  }

  const splitNotes = eventContent.notes ? eventContent.notes.split('\n').filter(paragraph => !_.isEmpty(paragraph)) : [];
  const splitPrizes = eventContent.prizes ? eventContent.prizes.split('\n').filter(paragraph => !_.isEmpty(paragraph)) : [];

  return (
    <div>
      <div className="section">
        <div className="level is-hidden-tablet">
          <div className="level-item" />
          {category &&
          <div className="level-item">
            <div className="image is-128x128 is-hidden-tablet">
              <img className="" alt="" src={category.image} />
            </div>
          </div>
          }
          <div className="level-item" />
        </div>
        <p className="is-hidden-tablet">&nbsp;</p>


        <div className="card">

          <div className="card-header is-vcentered">
            {category &&
            <figure className="image is-128x128 is-hidden-mobile">
              <img className="" alt="" src={category.image} />
            </figure>
            }
            <h1 className="card-header-title is-centered title has-text-success">
              {eventContent.name}
            </h1>
            {category &&
            <figure className="image is-128x128 is-hidden-mobile">
              <img className="" alt="" src={category.image} />
            </figure>
            }
          </div>
          <div className="card-header is-vcentered">
            <h2 className="card-header-title is-centered subtitle has-text-info">
              <p>{formattedDateWithDayName}</p>
            </h2>
          </div>
          <div className="card-header is-vcentered">
            <h2 className="card-header-title is-centered subtitle has-text-info">
              <p>
                {eventContent.time && <Fragment>{eventContent.time}</Fragment>}
              </p>
            </h2>
          </div>

          <div className="card-content">
            <div className="columns">

              <div className="column is-6 columns is-multiline">
                <div className="column is-12">
                  <div className="subtitle has-text-info"><Translate id="eventdetails" /></div>
                </div>
                <div className="column is-1" />
                <div className="column is-11">

                  {eventContent.date &&
                    <Fragment>
                      <i className="fas fa-calendar" />&nbsp;&nbsp;
                      {formattedDateWithDayName}
                      <br />
                    </Fragment>
                  }

                  {eventContent.time &&
                    <Fragment><i className="fas fa-clock" />&nbsp;&nbsp;{eventContent.time}<br /></Fragment>
                  }

                  {eventContent.format &&
                    <Fragment><i className="fas fa-book" />&nbsp;&nbsp;{eventContent.format}<br /></Fragment>
                  }

                  {eventContent.rulesLevel &&
                    <Fragment><i className="fas fa-balance-scale" />&nbsp;&nbsp;{eventContent.rulesLevel}<br /></Fragment>
                  }

                  {eventContent.entryFee &&
                    <Fragment><i className="fas fa-money-bill-alt" />&nbsp;&nbsp;{eventContent.entryFee}&nbsp;€<br /></Fragment>
                  }
                </div>

                {eventContent.notes && <ModalItem translationKey="notes" contentArray={splitNotes} />}
                {eventContent.prizes && <ModalItem translationKey="prizes" contentArray={splitPrizes} />}

                {eventContent.link &&
                  <Fragment>
                    <div className="column is-12">
                      <div className="subtitle has-text-info"><Translate id="link" /></div>
                    </div>

                    <div className="column is-1" />
                    <div className="column is-11">
                      <p>
                        <a href={eventContent.link} target="_blank" rel="noopener noreferrer">{eventContent.link}</a>
                      </p>
                    </div>
                  </Fragment>
                }
                <div className="column is-12">
                  <button id="sharebutton" className="button is-primary" data-clipboard-text={`${window.location.href}`}>
                    <i className="fas fa-copy" />&nbsp;&nbsp;
                    <Translate id="copylinktoevent" />
                  </button>
                </div>


              </div>
              <div className="column is-6">
                {isLoaded(events) &&
                  <Fragment>
                    <div className="subtitle has-text-info"><Translate id="participants" />&nbsp;
                      {!eventContent.playerSlots && <Fragment>({participationsForEvent.length})</Fragment>}
                      {eventContent.playerSlots && <Fragment>({participationsForEvent.length} / {eventContent.playerSlots})</Fragment>}
                    </div>
                  </Fragment>
                }
                {!isLoaded(events) &&
                  <div className="button is-loading">Loading</div>
                }
                {isLoaded(participations) && _.isEmpty(participations) &&
                  <div><Translate id="noparticipants" /></div>
                }
                {!_.isEmpty(participations) &&
                  <Fragment>
                    <div className="column is-1" />
                    <div className="column is-11">
                      <ParticipantList participations={participationsForEvent} maxParticipants={parseInt(_.get(eventContent, 'playerSlots', 0), 10)} />
                    </div>
                  </Fragment>
                }
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

        </div>
      </div>
    </div>
  );
};

SingleEvent.propTypes = {
  match: PropTypes.object,
  events: PropTypes.object,
  categories: PropTypes.object,
  settings: PropTypes.object,
  participations: PropTypes.object,
  auth: PropTypes.object,
  activeLanguage: PropTypes.string,
};
