import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Moment from 'react-moment';
import { isLoaded } from 'react-redux-firebase';

export default class EventModal extends Component {

  foo() {

  }

  render() {
    const { eventId, events, settings, closeModal, participations, categories } = this.props;

    if (isLoaded(events) && isLoaded(participations) && isLoaded(settings)) {

      const eventContent = _.get(events, eventId, {});
      const category = _.get(categories, eventContent.category);
      const dateFormat = _.get(settings, 'dateFormat');
      let participationsForEvent = Object.values(_.get(participations, eventId, []));
      participationsForEvent = _.sortBy(participationsForEvent, ['date']);

      return (
        <div className="modal is-active" id={`modal${eventId}`} key={`modal${eventId}`}>
          <div className="modal-background" onClick={closeModal} />
          <div className="modal-content">
            <div className="box is-rounded">
              <div className="columns is-multiline">

                <div className="column is-9">
                  <h1 className="title has-text-success">{eventContent.name}</h1>
                </div>

                {category &&
                  <div className="column is-3 has-text-right">
                    <figure className="image is-64x64 is-pulled-right">
                      <img alt="" src={category.image} />
                    </figure>
                  </div>
                }

                <div className="column is-12">
                  {eventContent.date &&
                    <Fragment>
                      <i className="fas fa-calendar" />&nbsp;&nbsp;
                      <Moment format={dateFormat}>{eventContent.date}</Moment>
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

                {eventContent.notes && <ModalItem translationKey="notes" content={eventContent.notes} />}
                {eventContent.prizes && <ModalItem translationKey="prizes" content={eventContent.prizes} />}

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

                {!_.isEmpty(participations) &&
                  <Fragment>

                    <div className="column is-12">
                      <div className="subtitle has-text-info"><Translate id="participants" /> ({participationsForEvent.length} / {eventContent.playerSlots})</div>
                    </div>
                    <div className="column is-1" />
                    <div className="column is-11">
                      <ParticipantList participations={participationsForEvent} maxParticipants={parseInt(_.get(eventContent, 'playerSlots', 0), 10)} />
                    </div>
                  </Fragment>
                }
              </div>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={closeModal} />
        </div>
      );
    }
    return <div />;
  }
}

const ModalItem = ({ translationKey, content }) => (
  <Fragment>
    {content &&
    <Fragment>
      <div className="column is-12">
        <div className="subtitle has-text-info"><Translate id={translationKey} /></div>
      </div>

      <div className="column is-1" />
      <div className="column is-11">
        <p>
          {content}
        </p>
      </div>
    </Fragment>
    }
    {!content && <span />}
  </Fragment>
);

const ParticipantList = ({ participations, maxParticipants }) => (
  <div>
    {participations && participations.map((participation, index) => {
      const coloration = index % 2 === 0 ? 'speech-bubble-even' : 'speech-bubble-odd';
      return (
        <div className="columns is-mobile" key={`participantModal-${participation.userId}`}>
          <div className={`column is-mobile has-text-left is-fixed-bottom commenter ${maxParticipants < (index + 1) && 'has-text-warning'}`}>{index + 1}. {participation.firstName} {participation.lastName} {maxParticipants < (index + 1) && <span>&nbsp;(<Translate id="waitlist" />)</span>}</div>
          {participation.comment &&
            <Fragment>
              <div className="column">
                <div className={`speech-bubble ${coloration} has-text-justified`}>
                  {participation.comment}
                </div>
              </div>
            </Fragment>
          }
          <hr />
        </div>

      );
    })}
  </div>
);

EventModal.propTypes = {
  eventId: PropTypes.string,
  events: PropTypes.object,
  closeModal: PropTypes.func,
  participations: PropTypes.object,
  categories: PropTypes.object,
  settings: PropTypes.object,
};

ParticipantList.propTypes = {
  participations: PropTypes.array,
  maxParticipants: PropTypes.number,
};

ModalItem.propTypes = {
  translationKey: PropTypes.string,
  content: PropTypes.string,
};
