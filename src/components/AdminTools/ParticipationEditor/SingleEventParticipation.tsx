import React, { Component } from "react";
import { FormattedMessage, IntlShape } from "react-intl";
import _ from "lodash";
import { participantCount, adminparticipate } from "../../../api/eventApi";
import { User, Participation } from "../../../models/ReduxState";
import { Category } from "../../../models/Category";
import { Settings } from "../../../models/Settings";
import { TourmericEvent } from "../../../models/Events";

interface Props {
  users: [{ key: string; value: User }];
  categories: { [key: string]: Category };
  participations: { [key: string]: Participation };
  admin: { [key: string]: string };
  chooseParticipant: (eventId: string, userUID: string) => void;
  settings: Settings;
  event: TourmericEvent;
  eventId: string;
}

interface State {
  firstName: string;
  lastName: string;
}

export default class SingleEventParticipation extends Component<
  Props,
  Partial<State>
> {
  state = { firstName: "", lastName: "" };

  savePlaceholderuser() {
    const { firstName, lastName } = this.state;
    const { eventId } = this.props;
    const userData: User = {
      firstName,
      lastName,
      avatarUrl: "",
      active: true,
      email: "",
      username: "",
    };
    const fakeUser = {
      key: `Placeholder-${Math.round(Math.random() * 1000)}`,
      value: userData,
    };
    adminparticipate(eventId, fakeUser);
  }

  render() {
    const {
      users,
      categories,
      participations,
      admin,
      settings,
      eventId,
      event,
      chooseParticipant,
    } = this.props;

    const dateFormat = _.get(settings, "dateFormat", "DD-MM-YYYY");
    const categoryName = _.get(
      categories[event.category],
      "name",
      "NO CATEGORY SET FOR EVENT"
    );

    return (
      <div key={`parteditor-${eventId}`} className="box column is-12">
        <div className="columns">
          <div className="column is-4 has-text-left">
            <h1 className="title">{event.name}</h1>
          </div>
          <div className="column is-2">
            <div>
              <span className="icon is-small is-left">
                <i className="fas fa-calendar" />
              </span>
              <Moment format={dateFormat}>{event.date}</Moment>
            </div>
            <div>
              <span className="icon is-small is-left">
                <i className="fas fa-clock" />
              </span>
              {event.time}
            </div>
          </div>
          <div className="column">{categoryName}</div>
        </div>
        <div className="columns">
          <div className="column is-2">
            {participantCount(eventId, participations)} / {event.playerSlots}
          </div>
          <div className="column is-10">
            <div className="field has-addons">
              <div className="control is-expanded">
                <div className="select has-text-right">
                  <select
                    className="input"
                    id="adminparticipation"
                    onChange={(e) => {
                      chooseParticipant(eventId, e.target.value);
                    }}
                  >
                    <option value="">
                      <FormattedMessage id="select" />
                    </option>
                    {users.map((userEntry) => {
                      const userId = userEntry.key;
                      const user = userEntry.value;
                      const alreadyParticipated = Boolean(
                        _.get(participations, `${eventId}.${userId}`)
                      );
                      const hasFullInfo = user.firstName && user.lastName;
                      if (alreadyParticipated || !hasFullInfo) {
                        return "";
                      }
                      return (
                        <option key={`part${eventId}${userId}`} value={userId}>
                          {user.firstName} {user.lastName} - {user.email} -{" "}
                          {userId}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="control">
                <button
                  className="button"
                  onClick={() =>
                    adminparticipate(
                      eventId,
                      _.find(users, { key: admin[eventId] })
                    )
                  }
                >
                  <FormattedMessage id="adduserparticipation" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-2">
            <FormattedMessage id="addplaceholderuser" />
          </div>
          <div className="column is-4">
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label">
                  <FormattedMessage id="firstname" />
                </label>
              </div>
              <div className="field-body">
                <input
                  className="input"
                  onChange={(change) => {
                    this.setState({ firstName: change.target.value });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="column is-4">
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label">
                  <FormattedMessage id="lastname" />
                </label>
              </div>
              <div className="field-body">
                <input
                  className="input"
                  onChange={(change) => {
                    this.setState({ lastName: change.target.value });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="column is-2">
            <button
              className="button"
              onClick={() => this.savePlaceholderuser()}
            >
              <FormattedMessage id="add" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
