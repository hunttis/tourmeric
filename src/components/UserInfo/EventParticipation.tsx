import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Translate } from 'react-localize-redux';
import EventModal from '../EventList/EventModal-container';
import { Settings } from '~/models/Settings';
import { TourmericEventEntry } from '~/models/Events';

interface Props {
  eventEntry: TourmericEventEntry;
  settings: Settings;
}

interface State {
  modalOpen: boolean;
}

export default class EventParticipation extends Component<Props, State> {

  state = { modalOpen: false };

  closeModal() {
    this.setState({ modalOpen: false });
  }

  openModal() {
    this.setState({ modalOpen: true });
  }

  render() {
    const { eventEntry, settings } = this.props;

    if (eventEntry.value) {

      const eventId = eventEntry.key;
      const event = eventEntry.value;

      return (
        <Fragment>
          {this.state.modalOpen &&
            <EventModal key={`modal${eventId}`} eventId={eventId} closeModal={() => this.closeModal()} />
          }
          <div className="box">
            <div className="level">
              <div className="level-left">
                <div>
                  <strong>{event.name}</strong><br />
                  <span className="icon is-small"><i className="fas fa-calendar" /></span>&nbsp;&nbsp;{moment(event.date).format(settings.dateFormat)}&nbsp;&nbsp;&nbsp;
                  <span className="icon is-small"><i className="fas fa-clock" /></span>&nbsp;&nbsp;{event.time}
                </div>
              </div>
              <div className="level-right">
                <button className="button is-primary" onClick={() => this.openModal()}><Translate id="moreinfo" /></button>
              </div>
            </div>
          </div>
        </Fragment>
      );
    }
    return <div><Translate id="loading" /></div>;

  }
}
