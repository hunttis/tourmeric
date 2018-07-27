import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import moment from 'moment';
import _ from 'lodash';
import PropTypes from 'prop-types';
import EditableEvent from './EditableEvent-container';

export default class AdminEventList extends Component {
  addEventButton() {
    return (
      <div className="level">
        <div className="level-left">
          <div className="field">
            <button
              className="button"
              onClick={() => {
              firebase.push('/events', { createDate: moment().toISOString(), date: moment().format('YYYY-MM-DD') });
            }}
            ><Translate id="addevent" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  listEditableEvents(eventList) {
    if (_.isEmpty(eventList)) {
      return <div><Translate id="noevents" /></div>;
    }
    const sortedList = _.sortBy(eventList, [e => e[1].date]);
    return (
      <div className="columns is-multiline">
        {sortedList.map(tournament =>
          <EditableEvent tournamentEntry={tournament} key={tournament[0]} />)}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.props.showNewEventButton && this.addEventButton()}
        {this.listEditableEvents(this.props.events)}
      </div>);
  }
}

AdminEventList.propTypes = {
  showNewEventButton: PropTypes.bool,
  events: PropTypes.array,
};
