import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import loadingImage from '../../images/Ripple-1s-64px.svg';
import EditableVerticalField from '../Common/EditableVerticalField-container';
import { checkParticipation } from '../../api/eventApi';

export default class UserInfo extends Component {

  userInfoBox() {
    const {
      profile, events, participations, userid,
    } = this.props;

    if (isLoaded(profile) && !isEmpty(profile) && isLoaded(events) && !isEmpty(events)) {
      const publishedEvents = Object.values(events).filter(event => event.value.published);
      const futureEvents = publishedEvents.filter(event => moment().isSameOrBefore(event.value.date) && checkParticipation(userid, event.key, participations));
      const pastEvents = publishedEvents.filter(event => moment().isAfter(event.value.date) && checkParticipation(userid, event.key, participations));

      return (
        <div>
          <div className="columns is-multiline">

            <div className="column is-6">
              <EditableVerticalField
                labelContent="firstname"
                placeHolder="firstnameplaceholder"
                defaultValue={profile.firstName}
                path={`/users/${this.props.auth.uid}`}
                targetName="firstName"
                idleIcon="fa-address-book"
                emptyClass="is-danger"
              />
            </div>

            <div className="column is-6">
              <EditableVerticalField
                labelContent="lastname"
                placeHolder="lastnameplaceholder"
                defaultValue={profile.lastName}
                path={`/users/${this.props.auth.uid}`}
                targetName="lastName"
                idleIcon="fa-address-book"
                emptyClass="is-danger"
              />
            </div>

            <div className="column is-6">
              <EditableVerticalField
                labelContent="email"
                placeHolder="emailplaceholder"
                defaultValue={profile.email}
                path={`/users/${this.props.auth.uid}`}
                targetName="email"
                idleIcon="fa-envelope"
                emptyClass="is-danger"
              />
            </div>

            <div className="column is-6">
              <EditableVerticalField
                labelContent="dcinumber"
                placeHolder="dcinumberplaceholder"
                defaultValue={profile.dciNumber}
                path={`/users/${this.props.auth.uid}`}
                targetName="dciNumber"
                idleIcon="fa-magic"
              />
            </div>

          </div>

          {!_.isEmpty(futureEvents) &&
          <DateBasedEvents
            title="nextparticipations"
            events={futureEvents}
            userid={userid}
            participations={participations}
          />}
          <p>&nbsp;</p>
          {!_.isEmpty(pastEvents) &&
          <DateBasedEvents
            title="pastparticipations"
            events={pastEvents}
            userid={userid}
            participations={participations}
          />}
        </div>
      );
    }
    return (
      <div className="level-item">
        <img src={loadingImage} alt="Loading" />
      </div>
    );
  }

  render() {
    const { profile } = this.props;
    const allInfoNotEntered = isLoaded(profile) && (!profile.lastName || !profile.firstName || !profile.email);
    const profileAllGood = isLoaded(profile) && profile.lastName && profile.firstName && profile.email;

    return (
      <section className="section">
        <h2 className="title">
          <Translate id="yourinfo" />
        </h2>
        <div className="level is-hidden-mobile" />
        {allInfoNotEntered &&
          <h2 className="subtitle has-text-warning has-icon-left">
            <i className="fas has-text-danger fa-exclamation-triangle" />&nbsp;
            <Translate id="someinformationismissing" />
          </h2>
        }
        {profileAllGood &&
          <h2 className="subtitle has-text-info has-icon-left">
            <i className="fas has-text-success fa-thumbs-up" />&nbsp;
            <Translate id="yourprofilelooksgoodtogo" />
          </h2>
        }
        {this.userInfoBox()}
      </section>
    );
  }
}

const DateBasedEvents = ({ title, events }) => (
  <div>
    <h1 className="title"><Translate id={title} /></h1>
    {Object.entries(events).map((eventEntry) => {
        const eventId = eventEntry[1].key;
        const event = eventEntry[1].value;
        return <EventParticipation key={`usereventlist${eventId}`} event={event} />;
      })}
  </div>
);

const EventParticipation = ({ event }) => (
  <div>
    <div className="columns">
      <div className="column is-2">
        {event.date}
      </div>
      <div className="column is-2">
        {event.time}
      </div>
      <div className="column is-8">
        {event.name}
      </div>
    </div>
  </div>
);

UserInfo.propTypes = {
  events: PropTypes.array,
  participations: PropTypes.object,
  profile: PropTypes.object,
  userid: PropTypes.string,
  auth: PropTypes.object,
};

EventParticipation.propTypes = {
  event: PropTypes.object,
};

DateBasedEvents.propTypes = {
  title: PropTypes.string,
  events: PropTypes.array,
};
