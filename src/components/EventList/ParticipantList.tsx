import React from 'react';
import { Translate } from 'react-localize-redux';
import { ParticipationData } from '~/models/ReduxState';

interface Props {
  participations: ParticipationData[];
  maxParticipants: number;
}

export const ParticipantList = ({ participations, maxParticipants }: Props) => (
  <div>
    {participations &&
      participations.map((participation, index) => {
        const coloration =
          index % 2 === 0 ? 'speech-bubble-even' : 'speech-bubble-odd';
        return (
          <div
            className="columns is-mobile"
            key={`participantModal-${participation.userId}`}
          >
            <div
              className={`column is-narrow is-mobile has-text-left is-fixed-bottom commenter ${maxParticipants !==
                0 &&
                maxParticipants < index + 1 &&
                'has-text-warning'}`}
            >
              {index + 1}. {participation.firstName} {participation.lastName}{' '}
              {maxParticipants < index + 1 && (
                <span>
                  &nbsp;(
                  <Translate id="waitlist" />)
                </span>
              )}
            </div>
            {participation.comment && (
              <div
                className={`speech-bubble ${coloration} has-text-justified column`}
              >
                {participation.comment}
              </div>
            )}
            <hr />
          </div>
        );
      })}
  </div>
);
