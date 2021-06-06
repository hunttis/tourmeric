import React, { Component } from 'react';
import firebase from 'firebase/app';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { FormattedMessage, IntlShape } from "react-intl";
import moment from 'moment';
import _ from 'lodash';
import { History } from 'history';
import { Participation } from '../../models/ReduxState';
import { Category } from '../../models/Category';
import { Settings } from '../../models/Settings';
import { TourmericEvent } from '../../models/Events';

interface Props {
  tournamentEntry: [string, TourmericEvent];
  participations: { [key: string]: Participation };
  categories: { [key: string]: Category };
  settings: Settings;
  index: number;
  history: History;
  setReturnLocation: (returnLocation: string) => void;
}

export class EditableEvent extends Component<Props> {

  participantCount() {
    const { tournamentEntry, participations } = this.props;
    const eventId = tournamentEntry[0];

    if (participations) {
      let participantNumber = 0;
      Object.entries(participations).forEach((participationentry) => {
        if (participationentry[0] === eventId) {
          participantNumber = Object.entries(participationentry[1]).length;
        }
      });
      return participantNumber;
    }
    return 0;
  }

  async editEvent(eventId: string) {
    await this.props.setReturnLocation(this.props.history.location.pathname);
    this.props.history.push(`/admin/events/editevent/${eventId}`);
  }

  copyEventForDate(targetDate: moment.Moment) {
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

  publishEvent(eventId: string) {
    firebase.update(`/events/${eventId}`, { published: true });
  }

  unpublishEvent(eventId: string) {
    firebase.update(`/events/${eventId}`, { published: false });
  }

  deleteEvent(eventId: string) {
    firebase.set(`/events/${eventId}`, {});
  }

  renderEventListItem(categories: { [key: string]: Category }, eventId: string, eventContent: TourmericEvent) {
    const { settings, index } = this.props;

    const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');
    const dateFormatted = eventContent.date ? moment(eventContent.date).format(dateFormat) : 'No date on event';

    return (
      <div className={`column is-12 box columns eventlistitem ${index % 2 === 0 && 'has-background-grey-darker'}`}>
        <div className="column is-3">
          <i className="fas fa-calendar" />&nbsp;&nbsp;{dateFormatted}
          &nbsp;&nbsp;&nbsp;
          <i className="fas fa-clock" />&nbsp;&nbsp;{eventContent.time}
        </div>
        <div className="column">
          {eventContent.category && categories[eventContent.category].abbreviation} - {eventContent.name}
        </div>
        <div className="column is-2">
          <button className="button is-small is-info" onClick={() => this.editEvent(eventId)}><i className="fas fa-edit" />&nbsp;&nbsp;<FormattedMessage id="edit" /></button>
          {!eventContent.published &&
            <button className="button is-small is-primary" onClick={() => this.publishEvent(eventId)}><i className="fas fa-door-open" />&nbsp;&nbsp;<FormattedMessage id="publish" /></button>
          }
          {(!eventContent.published && this.participantCount() === 0) &&
            <button className="button is-small is-danger" onClick={() => this.deleteEvent(eventId)}><i className="fas fa-trash" /></button>
          }
          {eventContent.published &&
            <button className="button is-small is-warning" onClick={() => this.unpublishEvent(eventId)}><i className="fas fa-door-closed" />&nbsp;&nbsp;<FormattedMessage id="unpublish" /></button>
          }
        </div>
        <div className="column is-4">
          <button className="button is-small" onClick={() => this.copyEvent()}><i className="fas fa-copy" />&nbsp;&nbsp;<FormattedMessage id="sameday" /></button>
          <button className="button is-small" onClick={() => this.copyEventForNextDay()}><i className="fas fa-copy" />&nbsp;&nbsp;<FormattedMessage id="nextday" /></button>
          <button className="button is-small" onClick={() => this.copyEventForNextWeek()}><i className="fas fa-copy" />&nbsp;&nbsp;<FormattedMessage id="nextweek" /></button>
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
      return <div><FormattedMessage id="nocategoriesgocreatesome" /></div>;
    }
    return <div><FormattedMessage id="loading" /></div>;
  }
}
