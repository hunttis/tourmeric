import React, { Component } from 'react';
import { isLoaded } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';
import EventParticipants from './EventParticipants-container';
import { participantCount, adminparticipate } from '../../../api/eventApi';

export default class ParticipationEditor extends Component {

  constructor(props) {
    super(props);
    this.toggleParticipantVisibility = this.toggleParticipantVisibility.bind(this);
  }

  toggleParticipantVisibility() {
    this.setState({ participantsHidden: !this.state.participantsHidden });
  }

  render() {
    const {
      users, categories, participations, events, admin, settings,
    } = this.props;
    const publishedEvents = Object.values(events).filter(event => event.value.published);
    const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');

    if (isLoaded(events) && isLoaded(categories) && isLoaded(participations) && isLoaded(users)) {
      return (
        <div>
          <div className="columns is-multiline">
            {publishedEvents.map((eventEntry) => {
              const eventId = eventEntry.key;
              const event = eventEntry.value;

              return (
                <div key={`parteditor-${eventId}`} className="box column is-12">
                  <div className="columns">
                    <div className="column is-4 has-text-left">
                      <h1 className="title">{event.name}</h1>
                    </div>
                    <div className="column is-2">
                      <div>
                        <span className="icon is-small is-left"><i className="fas fa-calendar" /></span>
                        &nbsp;<Moment format={dateFormat}>{moment(event.date)}</Moment>
                      </div>
                      <div>
                        <span className="icon is-small is-left"><i className="fas fa-clock" /></span>
                        &nbsp;{event.time}
                      </div>
                    </div>
                    <div className="column">{categories[event.category].name}</div>
                  </div>
                  <div className="columns">
                    <div className="column is-12">
                      <EventParticipants eventId={eventId} toggleParticipantVisibility={this.toggleParticipantVisibility} />
                    </div>
                  </div>
                  <div className="columns">

                    <div className="column is-2">
                      {participantCount(eventId, participations)} / {event.playerSlots}
                    </div>
                    <div className="column is-10">
                      <div className="field has-addons">
                        <div className="control is-expanded">
                          <div className="select has-text-right">
                            <select
                              className="input"
                              id="adminparticipation"
                              onChange={(e) => {
                                this.props.chooseParticipant(eventId, e.target.value);
                              }}
                            >
                              <option value=""><Translate id="select" /></option>
                              {users.map((userEntry) => {
                              const userId = userEntry.key;
                              const user = userEntry.value;
                              const alreadyParticipated = Boolean(_.get(participations, `${eventId}.${userId}`));
                              if (alreadyParticipated) {
                                return '';
                              }
                              return (
                                <option key={`part${eventId}${userId}`} value={userId}>
                                  {user.displayName} - {user.email} - {userId}
                                </option>
                              );
                            })}
                            </select>
                          </div>
                        </div>
                        <div className="control">
                          <button
                            className="button"
                            onClick={() => adminparticipate(eventId, _.find(users, { key: admin[eventId] }), admin[eventId])}
                          ><Translate id="adduserparticipation" />
                          </button>
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return <div><Translate id="loading" /></div>;
  }
}

ParticipationEditor.propTypes = {
  users: PropTypes.array,
  categories: PropTypes.object,
  participations: PropTypes.object,
  events: PropTypes.array,
  admin: PropTypes.object,
  chooseParticipant: PropTypes.func,
  settings: PropTypes.object,
};
