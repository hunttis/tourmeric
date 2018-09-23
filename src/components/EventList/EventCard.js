import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';
import _ from 'lodash';

import { ParticipateButton } from './ParticipateButton';
import { participantCount, checkParticipation } from '../../api/eventApi';
import EditableField from '../Common/EditableField-container';
import EventModal from './EventModal-container';

export default class EventCard extends Component {

  state = { modalOpen: false };

  openModal() {
    this.setState({ modalOpen: true });
  }

  closeModal() {
    this.setState({ modalOpen: false });
  }

  render() {
    const { eventId, events, userid, profile, participations, settings, categories } = this.props;

    const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');
    const dateFormatWithDayName = `${dateFormat} (dd)`;
    const eventContent = _.find(events, ['key', eventId]).value;
    const category = categories[eventContent.category];
    const alreadyParticipated = checkParticipation(userid, eventId, participations);
    const thisParticipation = _.get(participations, `${eventId}.${userid}`, []);
    const maxParticipants = _.get(eventContent, 'playerSlots', 0);
    const currentParticipants = participantCount(eventId, participations);
    const eventFull = maxParticipants <= currentParticipants;

    return (
      <Fragment>
        {this.state.modalOpen &&
          <EventModal key={`modal${eventId}`} eventId={eventId} closeModal={() => this.closeModal()} />
        }
        <div className="column is-12 eventcard">
          <h2 className="subtitle date-item">
            <Moment format={dateFormatWithDayName}>{eventContent.date}</Moment>
          </h2>
          <div className="card card-shadow">

            <div className="card-header eventheader">
              <div className="card-header-icon eventheader-text tooltip" data-tooltip={category.name}>
                <img className="image is-64x64" src={category.image} alt="" />
                {category.abbreviation}:
              </div>
              <div className="card-header-title eventheader-text">
                <div>{eventContent.name}</div>
              </div>
            </div>

            <div className="card-content">
              <div className="has-icons-left card-item">
                <span className="tooltip" data-tooltip="Starting time">
                  <i className="fas fa-clock" />&nbsp;&nbsp;{eventContent.time}
                </span>
              </div>
              <div className="has-icons-left card-item">
                <span className="tooltip" data-tooltip="Entry fee">
                  <i className="fas fa-money-bill-alt" />&nbsp;&nbsp;{eventContent.entryFee}&nbsp;€
                </span>
              </div>

              <div className={`has-icons-left card-item ${eventFull && 'has-text-warning'}`}>
                <span className="tooltip" data-tooltip="People already enrolled">
                  <i className="fas fa-users" />&nbsp;&nbsp;{currentParticipants}&nbsp;
                  {eventContent.playerSlots &&
                  <span>/&nbsp;{eventContent.playerSlots}&nbsp;
                    {eventFull && <span>(<Translate id="eventfull" />)</span>}
                  </span>}
                </span>
              </div>

              <div className="has-icons-left card-item">
                <div className="level">
                  {eventContent.format &&
                    <div className="level-left card-footer-items">
                      <span className="tooltip card-margin-right" data-tooltip="Format">
                        <i className="fas fa-book" />&nbsp;&nbsp;{eventContent.format}&nbsp;
                      </span>
                    </div>
                  }

                  {eventContent.rules &&
                    <div className="level-item card-footer-items">
                      <span className="tooltip card-margin-right" data-tooltip="Rules Level">
                        <i className="fas fa-balance-scale" />&nbsp;&nbsp;{eventContent.rulesLevel}
                      </span>
                    </div>
                  }

                  <div className="level-right card-footer-items ">
                    <a onClick={() => this.openModal()} className="card-footer-link">
                      <i className="fas fa-trophy" />&nbsp;&nbsp;<Translate id="allinfo" />
                    </a>
                  </div>

                </div>
              </div>

            </div>

            {/* CARD FOOTER ON TABLET AND ABOVE */}
            <div className="card-footer is-hidden-mobile">
              { alreadyParticipated &&
              <div className="card-footer-item event-card-footer">
                <EditableField
                  inputClasses="is-rounded"
                  leftIcon="comment"
                  labelContent=""
                  placeHolder="comment"
                  defaultValue={thisParticipation.comment}
                  path={`/participations/${eventId}/${userid}`}
                  targetName="comment"
                />
              </div>
              }
              <div className="card-footer-item event-card-footer">
                <ParticipateButton userId={userid} profile={profile} eventId={eventId} participations={participations} waitList={eventFull} />
              </div>
            </div>
            {/* END CARD FOOTER */}

            {/* CARD FOOTER ON MOBILE */}
            { alreadyParticipated &&
            <Fragment>
              <div className="card-footer is-hidden-tablet">
                <div className="card-footer-item event-card-footer">
                  <EditableField
                    inputClasses="is-rounded"
                    leftIcon="comment"
                    labelContent=""
                    placeHolder="comment"
                    defaultValue={thisParticipation.comment}
                    path={`/participations/${eventId}/${userid}`}
                    targetName="comment"
                  />
                </div>
              </div>
            </Fragment>
            }
            <div className="card-footer is-hidden-tablet">
              <div className="card-footer-item event-card-footer">
                <ParticipateButton userId={userid} profile={profile} eventId={eventId} participations={participations} waitList={eventFull} />
              </div>
            </div>
            {/* END CARD FOOTER */}

          </div>
          <p>&nbsp;</p>
          { moment(eventContent.date).isSameOrAfter(moment(), 'day') &&
          <div className="level participation-level">

            { !alreadyParticipated &&
              <div className="level-left is-hidden-mobile" />
            }

          </div>
        }
        </div>
      </Fragment>
    );
  }
}

EventCard.propTypes = {
  eventId: PropTypes.string,
  userid: PropTypes.string,
  profile: PropTypes.object,
  events: PropTypes.array,
  settings: PropTypes.object,
  participations: PropTypes.object,
  categories: PropTypes.object,
};
