import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import EventEditor from './EventEditor/EventEditor-container';

export default class EditableEvent extends Component {
  constructor(props) {
    super(props);
    this.toggleEventVisibility = this.toggleEventVisibility.bind(this);
  }

  state = { hidden: true }

  toggleEventVisibility() {
    const { hidden } = this.state;
    this.setState({ hidden: !hidden });
  }

  participantCount(tournamentid, participations) {
    if (participations) {
      let participantNumber = 0;
      Object.entries(participations).forEach((participationentry) => {
        if (participationentry[0] === tournamentid) {
          participantNumber = Object.entries(participationentry[1]).length;
        }
      });
      return <span className="tournamentparticipantcount">{participantNumber}</span>;
    }
    return 0;
  }

  renderEventListItem(categories, eventId, eventContent) {
    const { settings } = this.props;

    const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');
    const dateFormatted = moment(eventContent.date).format(dateFormat);

    return (
      <div className="column is-12 columns eventlistitem">
        <div className="column is-3">
          <i className="fas fa-calendar" />&nbsp;&nbsp;{dateFormatted}
        </div>
        <div className="column is-2">
          <i className="fas fa-clock" />&nbsp;&nbsp;{eventContent.time}
        </div>
        <div className="column is-small">
          {eventContent.category && categories[eventContent.category].abbreviation} - {eventContent.name}
        </div>
        <div className="column is-4">
          <button className="button is-small" onClick={this.toggleEventVisibility}><Translate id="editevent" /></button>
        </div>
      </div>
    );
  }

  render() {
    const { categories, tournamentEntry } = this.props;
    const categoriesDone = isLoaded(categories) && !isEmpty(categories);
    const eventId = tournamentEntry[0];
    const eventContent = tournamentEntry[1];

    if (categoriesDone && !this.state.hidden) {
      return <EventEditor categories={categories} eventId={eventId} eventContent={eventContent} toggleEventVisibility={this.toggleEventVisibility} />;
    }

    if (categoriesDone && this.state.hidden) {
      return this.renderEventListItem(categories, eventId, eventContent);
    }
    return <div><Translate id="loading" /></div>;
  }

}

EditableEvent.propTypes = {
  categories: PropTypes.object,
  tournamentEntry: PropTypes.array,
  settings: PropTypes.object,
};
