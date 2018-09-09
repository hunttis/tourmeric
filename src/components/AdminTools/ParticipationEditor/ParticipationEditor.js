import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import SingleEventParticipation from './SingleEventParticipation-container';

export default class ParticipationEditor extends Component {

  constructor(props) {
    super(props);
    this.toggleParticipantVisibility = this.toggleParticipantVisibility.bind(this);
  }

  toggleParticipantVisibility() {
    const { participantsHidden } = this.state;
    this.setState({ participantsHidden: !participantsHidden });
  }

  render() {
    const {
      users, categories, participations, events,
    } = this.props;


    if (isLoaded(events) && !isEmpty(events) && isLoaded(categories) && isLoaded(participations) && isLoaded(users)) {
      const publishedEvents = Object.values(events).filter(event => event.value.published);

      return (
        <div>
          <div className="columns is-multiline">
            {publishedEvents.map((eventEntry, index) => {
              const eventId = eventEntry.key;
              const event = eventEntry.value;
              return <SingleEventParticipation key={`singleevent-${index}`} event={event} eventId={eventId} />;
            })}
          </div>
        </div>
      );
    }
    if (isLoaded(events) && isLoaded(participations)) {
      if (isEmpty(events)) {
        return <div><Translate id="noevents" />. <Translate id="youmusthaveeventsbeforeparticipationscanhappen" />.</div>;
      }
    }

    return <div><Translate id="loading" /></div>;
  }
}

ParticipationEditor.propTypes = {
  users: PropTypes.array,
  categories: PropTypes.object,
  participations: PropTypes.object,
  events: PropTypes.array,
};
