import React from 'react';

import EditableField from '../../Common/EditableField-container';
import ParticipateButton from '../ParticipateButton-container';
import { Participation } from '~/models/ReduxState';

interface Props {
  alreadyParticipated: boolean;
  thisParticipation: Participation;
  eventId: string;
  userId: string;
}

export const CardFooterMobile = ({ alreadyParticipated, thisParticipation, eventId, userId }: Props) => (
  <>
    {alreadyParticipated &&
      <div className="card-footer is-hidden-tablet">
        <div className="card-footer-item event-card-footer">
          <EditableField
            inputClasses="is-rounded"
            leftIcon="comment"
            labelContent=""
            placeHolder="comment"
            defaultValue={thisParticipation.comment}
            path={`/participations/${eventId}/${userId}`}
            targetName="comment"
          />
        </div>
      </div>
    }
    <div className="card-footer is-hidden-tablet">
      <div className="card-footer-item event-card-footer">
        <ParticipateButton eventId={eventId} />
      </div>
    </div>
  </>
);
