import React, { Component } from 'react';
import firebase from 'firebase/app';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import EventEditor from './EventEditor/EventEditor-container';

export default class EditableEvent extends Component {

  state = { modalOpenClass: '' }

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

  openModal() {
    this.setState({ modalOpenClass: 'is-active' });
  }

  closeModal() {
    this.setState({ modalOpenClass: '' });
  }

  copyEventForDate(targetDate) {
    const { tournamentEntry } = this.props;
    const newCopy = _.clone(tournamentEntry[1]);
    const copyObject = Object.assign(newCopy, { createDate: moment().toISOString(), date: moment(targetDate).format('YYYY-MM-DD'), published: false });
    firebase.push('/events', copyObject);
  }

  copyEvent() {
    const { tournamentEntry } = this.props;
    const eventContent = tournamentEntry[1];
    this.copyEventForDate(moment(eventContent.date, 'YYYY-MM-DD'));
  }

  copyEventForNextDay() {
    const { tournamentEntry } = this.props;
    const eventContent = tournamentEntry[1];
    const tomorrow = moment(eventContent.date, 'YYYY-MM-DD').add(1, 'day');
    this.copyEventForDate(tomorrow);
  }

  copyEventForNextWeek() {
    const { tournamentEntry } = this.props;
    const eventContent = tournamentEntry[1];
    const tomorrow = moment(eventContent.date, 'YYYY-MM-DD').add(7, 'day');
    this.copyEventForDate(tomorrow);
  }

  publishEvent(eventId) {
    firebase.update(`/events/${eventId}`, { published: true });
  }

  unpublishEvent(eventId) {
    firebase.update(`/events/${eventId}`, { published: false });
  }

  renderEventListItem(categories, eventId, eventContent) {
    const { settings, index } = this.props;
    const { modalOpenClass } = this.state;

    const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');
    const dateFormatted = moment(eventContent.date).format(dateFormat);

    return (
      <div className={`column is-12 box columns eventlistitem ${index % 2 === 0 && 'has-background-grey-darker'}`}>
        <div className={`modal ${modalOpenClass}`}>
          <div className="modal-background" onClick={() => this.closeModal()} />
          <div className="modal-content box">
            <EventEditor categories={categories} eventId={eventId} eventContent={eventContent} toggleEventVisibility={() => this.closeModal()} />
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => this.closeModal()} />
        </div>
        <div className="column is-3">
          <i className="fas fa-calendar" />&nbsp;&nbsp;{dateFormatted}
          &nbsp;&nbsp;&nbsp;
          <i className="fas fa-clock" />&nbsp;&nbsp;{eventContent.time}
        </div>
        <div className="column">
          {eventContent.category && categories[eventContent.category].abbreviation} - {eventContent.name}
        </div>
        <div className="column is-2">
          <button className="button is-small is-info" onClick={() => this.openModal()}><i className="fas fa-edit" />&nbsp;&nbsp;<Translate id="edit" /></button>
          {!eventContent.published &&
            <button className="button is-small is-primary" onClick={() => this.publishEvent(eventId)}><i className="fas fa-door-open" />&nbsp;&nbsp;<Translate id="publish" /></button>
          }
          {eventContent.published &&
            <button className="button is-small is-warning" onClick={() => this.unpublishEvent(eventId)}><i className="fas fa-door-closed" />&nbsp;&nbsp;<Translate id="unpublish" /></button>
          }
        </div>
        <div className="column is-4">
          <button className="button is-small" onClick={() => this.copyEvent()}><i className="fas fa-copy" />&nbsp;&nbsp;<Translate id="sameday" /></button>
          <button className="button is-small" onClick={() => this.copyEventForNextDay()}><i className="fas fa-copy" />&nbsp;&nbsp;<Translate id="nextday" /></button>
          <button className="button is-small" onClick={() => this.copyEventForNextWeek()}><i className="fas fa-copy" />&nbsp;&nbsp;<Translate id="nextweek" /></button>
        </div>
      </div>
    );
  }

  render() {
    const { categories, tournamentEntry } = this.props;
    const categoriesDone = isLoaded(categories) && !isEmpty(categories);
    const eventId = tournamentEntry[0];
    const eventContent = tournamentEntry[1];

    if (categoriesDone) {
      return this.renderEventListItem(categories, eventId, eventContent);
    }

    if (isLoaded(categories) && isEmpty(categories)) {
      return <div><Translate id="nocategoriesgocreatesome" /></div>;
    }
    return <div><Translate id="loading" /></div>;
  }
}

EditableEvent.propTypes = {
  categories: PropTypes.object,
  tournamentEntry: PropTypes.array,
  settings: PropTypes.object,
  index: PropTypes.number,
};
