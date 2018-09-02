import React, { Component, Fragment } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import loadingImage from '../../images/Ripple-1s-64px.svg';
import EditableVerticalField from '../Common/EditableVerticalField-container';
import StoreCreditTableUser from './StoreCreditTableUser';
import { checkParticipation } from '../../api/eventApi';
import { DateBasedEvents } from './DateBasedEvents';

export default class UserInfo extends Component {

  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  calculateTotal(creditData) {
    let total = 0.0;
    for (const dataItem of Object.values(creditData)) {
      total += dataItem.value;
    }
    return total;
  }

  openCreditModal() {
    this.setState({ modalOpen: true });
  }

  closeCreditModal() {
    this.setState({ modalOpen: false });
  }


  userInfoBox() {
    const {
      profile, events, participations, userid, settings, storecredit,
    } = this.props;

    if (isLoaded(profile) && !isEmpty(profile) && isLoaded(events) && isLoaded(storecredit)) {
      const userCredit = storecredit[userid];
      const total = _.isEmpty(userCredit) ? 0 : this.calculateTotal(userCredit);

      const publishedEvents = events ? Object.values(events).filter(event => event.value.published) : [];
      const futureEvents = publishedEvents && isLoaded(participations) && !isEmpty(participations) ? publishedEvents.filter(event => moment().isSameOrBefore(event.value.date) && checkParticipation(userid, event.key, participations)) : [];
      const pastEvents = pastEvents && isLoaded(participations) && !isEmpty(participations) ? publishedEvents.filter(event => moment().isAfter(event.value.date) && checkParticipation(userid, event.key, participations)) : [];
      const eventsActive = _.get(settings, 'features.events.active', false);

      return (
        <div>
          {this.creditModal()}
          <div className="columns is-multiline">

            <div className="column is-6">
              <h1 className="title"><Translate id="personalinfo" /></h1>
              <div className="columns is-multiline">

                <div className="column is-12">
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

                <div className="column is-12">
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

                <div className="column is-12">
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

                <div className="column is-12">
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
            </div>
            <div className="column is-6">

              <h1 className="title"><Translate id="storecredit" /></h1>
              <div className="box">
                <div className="columns is-mobile">
                  <div className="column is-6 has-text-left">
                    {total} €
                  </div>
                  <div className="column is-6 has-text-right">
                    {userCredit &&
                      <button className="button is-primary" onClick={() => this.openCreditModal()}><Translate id="credithistory" /></button>
                    }
                  </div>
                </div>
              </div>

              {eventsActive &&
                <Fragment>
                  {!_.isEmpty(futureEvents) &&
                  <DateBasedEvents
                    title="nextparticipations"
                    events={futureEvents}
                  />}
                  <p>&nbsp;</p>
                  {!_.isEmpty(pastEvents) &&
                  <DateBasedEvents
                    title="pastparticipations"
                    events={pastEvents}
                  />}
                </Fragment>
              }
            </div>

          </div>
        </div>
      );
    }
    return (
      <div className="level-item">
        <img src={loadingImage} alt="Loading" />
      </div>
    );
  }

  creditModal() {
    const { userid, storecredit } = this.props;
    const userCreditData = storecredit[userid];
    const modalActive = this.state.modalOpen ? 'is-active' : '';

    if (userCreditData) {
      return (
        <div className={`modal ${modalActive}`} id={`modalcredit${userid}`} key={`modalcredit${userid}`}>
          <div className="modal-background" onClick={() => this.closeCreditModal()} />
          <div className="modal-content">
            <div className="box is-rounded">

              <StoreCreditTableUser key={userid} userId={userid} creditData={userCreditData} />

            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => this.closeCreditModal()} />
        </div>

      );
    }
    return <div>No data</div>;
  }

  render() {
    const { profile } = this.props;
    const allInfoNotEntered = isLoaded(profile) && (!profile.lastName || !profile.firstName || !profile.email);
    const profileAllGood = isLoaded(profile) && profile.lastName && profile.firstName && profile.email;

    return (
      <section className="section">
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


UserInfo.propTypes = {
  events: PropTypes.array,
  participations: PropTypes.object,
  profile: PropTypes.object,
  userid: PropTypes.string,
  auth: PropTypes.object,
  settings: PropTypes.object,
  storecredit: PropTypes.object,
};
