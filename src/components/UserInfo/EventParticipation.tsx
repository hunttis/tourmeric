import React from 'react';
import moment from 'moment';
import { FormattedMessage, IntlShape } from "react-intl";
import { History } from 'history';
import { Settings } from '../../models/Settings';
import { TourmericEventEntry } from '../../models/Events';

interface Props {
  eventEntry: TourmericEventEntry;
  settings: Settings;
  history: History;
}

export const EventParticipation = ({ eventEntry, settings, history }: Props) => {

  if (eventEntry.value) {

    const eventId = eventEntry.key;
    const event = eventEntry.value;

    return (
      <>
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
              <button className="button is-primary" onClick={() => history.push(`/event/${eventId}`)}><FormattedMessage id="moreinfo" /></button>
            </div>
          </div>
        </div>
      </>
    );
  }
  return <div><FormattedMessage id="loading" /></div>;

};
