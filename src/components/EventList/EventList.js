import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import EventCalendar from './EventCalendar-container';
import EventListOld from './EventListOld-container';

export default class EventList extends Component {

  foo() {}

  render() {
    const { profile } = this.props;

    if (_.get(profile, 'betaparticipation.eventsPreference', '') === 'calendar') {
      return <EventCalendar />;
    }
    return <EventListOld />;
  }
}

EventList.propTypes = {
  profile: PropTypes.object,
};
