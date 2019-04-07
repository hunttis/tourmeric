import React, { Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

export const OpeningHours = ({ day, settings, openinghoursexceptions }) => {

  if (isLoaded(settings) && isLoaded(openinghoursexceptions)) {

    const dayMoment = day ? moment(day, 'YYYY-MM-DD') : moment();
    const isToday = moment().isSame(dayMoment, 'day');
    const todayName = dayMoment.format('dddd').toLowerCase();
    const dateString = dayMoment.format('YYYY-MM-DD');
    const daysHours = _.get(settings, `openingHours.${todayName}`, '');
    const exception = _.get(openinghoursexceptions, dateString);

    if (exception) {
      if (exception.status === 'closed') {
        return (
          <Fragment>
            <span className="has-text-danger">
              {isToday &&
                <Translate id="exceptionallynotopentoday" />
              }
              {!isToday &&
                <Translate id="exceptionallynotopen" />
              }
            </span>
              : {exception.name}
          </Fragment>
        );
      }
      return (
        <Fragment>
          <span className="has-text-success">
            {isToday &&
              <Translate id="exceptionallyopentoday" />
            }
            {!isToday &&
              <Translate id="exceptionallyopen" />
            }
          </span>
            : {exception.openingHours}
          <p>{exception.name}</p>
        </Fragment>
      );
    }
    if (_.isEmpty(daysHours)) {
      return (
        <Fragment>
          {isToday &&
            <Fragment><Translate id="closedtoday" /></Fragment>
          }
          {!isToday &&
            <Fragment><Translate id="closed" /></Fragment>
          }
        </Fragment>
      );
    }
    return (
      <Fragment>
        {isToday &&
          <Fragment><Translate id="opentoday" /> : <span className="has-text-success">{daysHours}</span></Fragment>
        }
        {!isToday &&
          <Fragment><Translate id="open" /> : <span className="has-text-success">{daysHours}</span></Fragment>
        }
      </Fragment>
    );

  }
  return <div />;

};

OpeningHours.propTypes = {
  day: PropTypes.string,
  settings: PropTypes.object,
  openinghoursexceptions: PropTypes.object,
};
