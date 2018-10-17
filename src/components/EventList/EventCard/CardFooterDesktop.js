import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import EditableField from '../../Common/EditableField-container';
import ParticipateButton from '../ParticipateButton-container';

export const CardFooterDesktop = ({ alreadyParticipated, thisParticipation, eventId, userId }) => (
  <Fragment>
    <div className="card-footer is-hidden-mobile">
      { alreadyParticipated &&
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
      }
      <div className="card-footer-item event-card-footer">
        <ParticipateButton eventId={eventId} />
      </div>
    </div>
  </Fragment>
);

CardFooterDesktop.propTypes = {
  alreadyParticipated: PropTypes.bool.isRequired,
  thisParticipation: PropTypes.object.isRequired,
  eventId: PropTypes.string.isRequired,
  userId: PropTypes.string,
};
