import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import moment from 'moment/min/moment-with-locales';
import _ from 'lodash';
import { isLoaded } from 'react-redux-firebase';

import { participantCount, checkParticipation } from '../../../api/eventApi';
import EventModal from '../EventModal-container';
import { CardFooterMobile } from './CardFooterMobile';
import { CardFooterDesktop } from './CardFooterDesktop';
import { TourmericEvent } from '~/models/Events';
import { History } from 'history';
import { Settings } from '~/models/Settings';
import { Category } from '~/models/Category';
import { Participation } from '~/models/ReduxState';

interface Props {
  eventId: string;
  userId: string;
  events: { [key: string]: TourmericEvent };
  eventsongoing: { [key: string]: TourmericEvent };
  participations: { [key: string]: Participation };
  categories: { [key: string]: Category };
  history: History;
  settings: Settings;
  isAdmin: boolean;
  setReturnLocation: (key: string) => void;
}

interface State {
  modalOpen: boolean;
  isOngoingEvent: boolean;
}

export default class EventCard extends Component<Props, State> {

  state = { modalOpen: false, isOngoingEvent: !this.props.events[this.props.eventId] };

  openModal() {
    this.setState({ modalOpen: true });
  }

  closeModal() {
    this.setState({ modalOpen: false });
  }

  async editEvent() {
    const { eventId, history } = this.props;
    await this.props.setReturnLocation(history.location.pathname);
    if (this.state.isOngoingEvent) {
      this.props.history.push(`/admin/events/editongoingevent/${eventId}`);
    } else {
      this.props.history.push(`/admin/events/editevent/${eventId}`);
    }
  }

  render() {
    const { eventId, events, eventsongoing, userId, participations, categories, settings, isAdmin } = this.props;

    if (!isLoaded(events) && !isLoaded(eventsongoing)) {
      return <div />;
    }

    const eventContent = events[eventId] ? events[eventId] : eventsongoing[eventId];

    if (!eventContent || !eventContent.date) {
      return <div><Translate id="eventidnotfound" /></div>;
    }

    const category: Category | {} = isLoaded(categories) ? categories[eventContent.category] : {};
    const alreadyParticipated = checkParticipation(userId, eventId, participations);
    const thisParticipation = _.get(participations, `${eventId}.${userId}`, {});
    const maxParticipants = parseInt(_.get(eventContent, 'playerSlots', '0'), 10);
    const currentParticipants = participantCount(eventId, participations);
    const eventFull = Boolean(maxParticipants && maxParticipants <= currentParticipants);
    const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');
    const formattedDateWithDayName = moment(eventContent.date, 'YYYY-MM-DD').format(`${dateFormat} (dddd)`);
    const formattedEndDateWithDayName = eventContent.endDate ? moment(eventContent.endDate, 'YYYY-MM-DD').format(`${dateFormat} (dddd)`) : null;

    const playerSlotsString = eventContent.playerSlots ? `/ ${eventContent.playerSlots} ` : '';

    const participantString = `${currentParticipants} ${playerSlotsString}`;

    const columnSpan = 4;

    return (
      <Fragment>
        {this.state.modalOpen &&
          <EventModal key={`modal${eventId}`} eventId={eventId} closeModal={() => this.closeModal()} />
        }
        <div className="column is-12 eventcard">
          <div className={`card card-shadow ${formattedEndDateWithDayName && 'ongoing-event-card'}`}>

            <div className={`card-content card-title card-logo-title ${formattedEndDateWithDayName && 'ongoing-event-card-title'}`}>
              <figure className="image event-icon-title event-item">
                <img className={`${formattedEndDateWithDayName && 'ongoing-event-image'}`} src={_.get(category, 'image')} alt="" />
              </figure>
            </div>
            <div className="card-content">
              <div className="media has-icons-right">
                <div className="media-content event-card-title">
                  <p className={`subtitle ${formattedEndDateWithDayName ? 'has-text-success' : 'has-text-info'}`}>{formattedDateWithDayName}{formattedEndDateWithDayName ? ` - ${formattedEndDateWithDayName}` : ''}</p>
                  <p className="title eventheader">{_.get(category, 'abbreviation')}: {eventContent.name}</p>
                </div>
                {isAdmin &&
                  <button className="button is-small" onClick={() => this.editEvent()}><i className="fas fa-pencil-alt" /></button>
                }
              </div>
            </div>

            <div className="card-content">
              <table className="table eventinfo-table">
                <tbody>
                  <CardInfoLine icon="fas fa-clock" title="startingtime" content={eventContent.time} />
                  <CardInfoLine icon="fas fa-money-bill-alt" title="entryfee" content={eventContent.entryFee} />
                  <CardInfoLine icon="fas fa-users" title="participants" content={participantString} extraClasses={eventFull ? 'has-text-warning' : ''} />
                  {eventFull && <tr><td colSpan={columnSpan} className="has-text-centered has-text-warning">(<Translate id="eventfull" />)</td></tr>}
                  {eventContent.format && <CardInfoLine icon="fas fa-book" title="format" content={eventContent.format} />}
                  {eventContent.rules && <CardInfoLine icon="fas fa-balance-scale" title="ruleslevel" content={eventContent.rulesLevel} />}
                </tbody>
              </table>

              <div className="allinfolink">
                <a onClick={() => this.props.history.push(`/event/${eventId}`)} className="card-footer-link">
                  <i className="fas fa-trophy" />&nbsp;&nbsp;<Translate id="allinfo" />
                </a>
              </div>
            </div>

            <CardFooterDesktop
              alreadyParticipated={alreadyParticipated}
              thisParticipation={thisParticipation}
              eventId={eventId}
              userId={userId}
            />

            <CardFooterMobile
              alreadyParticipated={alreadyParticipated}
              thisParticipation={thisParticipation}
              eventId={eventId}
              userId={userId}
            />

          </div>
          <p>&nbsp;</p>
          {moment(eventContent.date).isSameOrAfter(moment(), 'day') &&
            <div className="level participation-level">

              {!alreadyParticipated &&
                <div className="level-left is-hidden-mobile" />
              }

            </div>
          }
        </div>
      </Fragment>
    );
  }
}

interface CardInfoLineProps {
  icon: string;
  title: string;
  content: string;
  extraClasses?: string;
}

const CardInfoLine = ({ icon, title, content, extraClasses = '' }: CardInfoLineProps) => (
  <Fragment>
    <tr className={extraClasses}>
      <td><i className={icon} /></td>
      <td><Translate id={title} /></td>
      <td>{content}</td>
    </tr>
  </Fragment>
);
