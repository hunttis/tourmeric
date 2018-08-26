import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';
import _ from 'lodash';

import { ParticipateButton } from './ParticipateButton';
import { participantCount, checkParticipation } from '../../api/eventApi';
import EditableField from '../Common/EditableField-container';

export default class EventCard extends Component {

  eventHeader(eventContent) {
    const { categories } = this.props;
    const category = categories[eventContent.category];
    return (
      <div className="card-header eventheader">
        <div className="card-header-icon eventheader-text tooltip" data-tooltip={category.name}>
          <img className="image is-64x64" src={category.image} alt="" />
          {category.abbreviation}:
        </div>
        <div className="card-header-title eventheader-text">
          <div>{eventContent.name}</div>
        </div>
      </div>
    );
  }

  render() {
    const { eventId, events, userid, profile, participations, openModal, settings } = this.props;
    const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');
    const eventContent = _.find(events, ['key', eventId]).value;
    const alreadyParticipated = checkParticipation(userid, eventId, participations);
    const thisParticipation = _.get(participations, `${eventId}.${userid}`, []);

    return (
      <div className="column eventcard">
        <h2 className="subtitle date-item">
          <Moment format={dateFormat}>{eventContent.date}</Moment>
        </h2>
        <div className="card card-shadow">

          {this.eventHeader(eventContent)}

          <div className="card-content">
            <div className="has-icons-left card-item">
              <span className="tooltip" data-tooltip="Starting time"><i className="fas fa-clock" />&nbsp;&nbsp;{eventContent.time}</span>
            </div>
            <div className="has-icons-left card-item">
              <span className="tooltip" data-tooltip="Entry fee"><i className="fas fa-money-bill-alt" />&nbsp;&nbsp;{eventContent.entryFee}&nbsp;€</span>
            </div>

            <div className="has-icons-left card-item">
              <span className="tooltip" data-tooltip="People already enrolled"><i className="fas fa-users" />&nbsp;&nbsp;{participantCount(eventId, participations)}&nbsp;/&nbsp;{eventContent.playerSlots}&nbsp;
              </span>
            </div>

            <div className="has-icons-left card-item">
              <div className="level">
                {eventContent.format &&
                  <div className="level-left card-footer-items">
                    <span className="tooltip card-margin-right" data-tooltip="Format"><i className="fas fa-book" />&nbsp;&nbsp;{eventContent.format}&nbsp;</span>
                  </div>
                }

                {eventContent.rules &&
                  <div className="level-item card-footer-items">
                    <span className="tooltip card-margin-right" data-tooltip="Rules Level"><i className="fas fa-balance-scale" />&nbsp;&nbsp;{eventContent.rulesLevel}</span>
                  </div>
                }

                {(eventContent.notes || eventContent.prizes || eventContent.link) &&
                  <div className="level-right card-footer-items ">
                    <a onClick={openModal} className="card-footer-link">
                      <i className="fas fa-trophy" />&nbsp;&nbsp;<Translate id="allinfo" />
                    </a>
                  </div>
                }

              </div>
            </div>

          </div>

        </div>
        <p>&nbsp;</p>
        { moment(eventContent.date).isSameOrAfter(moment(), 'day') &&
          <div className="level participation-level">
            { alreadyParticipated &&
              <div className="level-left">
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
            { !alreadyParticipated &&
              <div className="level-left is-hidden-mobile" />
            }
            <div className="level-right is-pulled-right">
              <ParticipateButton userId={userid} profile={profile} eventId={eventId} participations={participations} />
            </div>
          </div>
        }
      </div>
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
  openModal: PropTypes.func,
};
