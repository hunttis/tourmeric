import React from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

export const EventModal = ({ eventId, eventContent, closeModal, participations }) => (
  <div className="modal" id={`modal${eventId}`} key={`modal${eventId}`}>
    <div className="modal-background" onClick={closeModal} />
    <div className="modal-content">
      <div className="box is-rounded">
        <div className="columns is-multiline">

          <ModalItem translationKey="notes" content={eventContent.notes} />
          <ModalItem translationKey="prizes" content={eventContent.prizes} />

          {eventContent.link &&
          <div className="column is-12">
            <div className="title"><Translate id="link" /></div>
            <p>
              <a href={eventContent.link}>{eventContent.link}</a>
            </p>
          </div>
          }
          {!_.isEmpty(participations) &&
          <div className="column is-12">
            <div>
              <div className="title"><Translate id="participants" /></div>
              <ParticipantList participations={participations} />
            </div>
          </div>
          }
        </div>
      </div>
    </div>
    <button className="modal-close is-large" aria-label="close" onClick={closeModal} />
  </div>
);

const ModalItem = ({ translationKey, content }) => (
  <div className="column is-12">
    {content &&
      <div>
        <div className="title"><Translate id={translationKey} /></div>
        <p>
          {content}
        </p>
      </div>
    }
  </div>
);

const ParticipantList = ({ participations }) => (
  <div>
    {participations.map(participation => (
      <div className="level is-marginless" key={`participantModal-${participation.userId}`}>
        <div className="level-left">{participation.firstName}&nbsp;{participation.lastName}</div>
        {participation.comment &&
          <div className="level-item">{participation.comment}</div>
        }
      </div>
    ))}
  </div>
);

EventModal.propTypes = {
  eventId: PropTypes.string,
  eventContent: PropTypes.object,
  closeModal: PropTypes.func,
  participations: PropTypes.array,
};

ParticipantList.propTypes = {
  participations: PropTypes.array,
};

ModalItem.propTypes = {
  translationKey: PropTypes.string,
  content: PropTypes.string,
};
