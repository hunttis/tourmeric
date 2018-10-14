import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import EditableField from '../../Common/EditableField-container';
import ParticipateButton from '../ParticipateButton-container';

export const CardFooterMobile = ({ alreadyParticipated, thisParticipation, eventId, userId }) => (
  <Fragment>
    { alreadyParticipated &&
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
  </Fragment>
);

CardFooterMobile.propTypes = {
  alreadyParticipated: PropTypes.bool.isRequired,
  thisParticipation: PropTypes.object.isRequired,
  eventId: PropTypes.string.isRequired,
  userId: PropTypes.string,
};
