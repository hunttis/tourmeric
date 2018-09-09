import React, { Component, Fragment } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';
import loadingImage from '../../images/Ripple-1s-64px.svg';
import EditableVerticalField from '../Common/EditableVerticalField-container';
import StoreCreditTableUser from './StoreCreditTableUser';
import { checkParticipation } from '../../api/eventApi';
import { DateBasedEvents } from './DateBasedEvents';

export default class UserInfo extends Component {

  constructor(props) {
    super(props);
    this.state = { modalOpen: false, privacyPolicyModalOpen: false };
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

  openPrivacyPolicyModal() {
    this.setState({ privacyPolicyModalOpen: true });
  }

  closePrivacyPolicyModal() {
    this.setState({ privacyPolicyModalOpen: false });
  }

  async acceptPrivacyPolicy() {
    await firebase.update(`/users/${this.props.auth.uid}`, { acceptedPrivacyPolicy: moment().format('YYYY-MM-DD') });
    this.closePrivacyPolicyModal();
  }

  userInfoBox() {
    const {
      profile, events, participations, userid, settings, storecredit, categories,
    } = this.props;

    if (isLoaded(profile) && !isEmpty(profile) && isLoaded(events) && isLoaded(storecredit) && isLoaded(categories)) {
      const userCredit = storecredit[userid];
      const total = _.isEmpty(userCredit) ? 0 : this.calculateTotal(userCredit);
      const hasAcceptedPrivacyPolicy = _.get(profile, 'acceptedPrivacyPolicy', false);

      const publishedEvents = events ? Object.values(events).filter(event => event.value.published) : [];
      const futureEvents = publishedEvents && isLoaded(participations) && !isEmpty(participations) ? publishedEvents.filter(event => moment().isSameOrBefore(event.value.date) && checkParticipation(userid, event.key, participations)) : [];
      const pastEvents = pastEvents && isLoaded(participations) && !isEmpty(participations) ? publishedEvents.filter(event => moment().isAfter(event.value.date) && checkParticipation(userid, event.key, participations)) : [];
      const eventsActive = _.get(settings, 'features.events.active', false);
      const privacyPolicyContent = _.get(settings, 'privacyPolicy', '');

      return (
        <div>
          {this.creditModal()}
          <div className="columns is-multiline">

            {!hasAcceptedPrivacyPolicy &&
            <div className="column is-12">
              <div className="button is-danger" onClick={() => this.openPrivacyPolicyModal()}>
                <Translate id="pleaseclickheretoreadourandacceptprivacypolicytoproceed" />
              </div>
            </div>
            }

            <div key="privacyPolicyModal" className={`modal ${this.state.privacyPolicyModalOpen ? 'is-active' : ''}`}>
              <div className="modal-background" onClick={() => this.closePrivacyPolicyModal()} />
              <div className="modal-content">
                <div className="box">
                  <div className="content">
                    {!_.isEmpty(privacyPolicyContent) && privacyPolicyContent.split('\n').map((paragraph, index) => <p key={`privacyPolicy-userinfo-${index}`}>{paragraph}</p>)}
                  </div>
                  <div className="button" onClick={() => this.acceptPrivacyPolicy()}>
                    <Translate id="accept" />
                  </div>
                  <div className="button" onClick={() => this.closePrivacyPolicyModal()}>
                    <Translate id="decline" />
                  </div>
                </div>
              </div>
              <button className="modal-close is-large" aria-label="close" onClick={() => this.closePrivacyPolicyModal()} />
            </div>

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
              {this.myFavoriteGames()}
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

  myFavoriteGames() {
    const { categories, profile } = this.props;
    const chosenCategories = profile.favoriteCategories || '';

    return (
      <Fragment>
        <h2 className="subtitle">
          Choose the games you want to see in your today view
        </h2>
        {Object.entries(categories).map((categoryEntry) => {
          const category = categoryEntry[1];
          const categoryChosen = chosenCategories.indexOf(category.name) !== -1;

          return (
            <button key={`categorytoggle-${category.name}`} onClick={() => this.toggleCategory(category.name)} className={`button ${categoryChosen ? 'is-success' : 'is-info'}`}>
              {category.name}
            </button>

          );
        })}

      </Fragment>
    );
  }

  async toggleCategory(categoryName) {
    console.log('toggling', categoryName);
    const { profile } = this.props;
    const chosenCategories = profile.favoriteCategories || '';
    let modifiedCategories;
    if (chosenCategories.indexOf(categoryName) === -1) {
      console.log('adding');
      modifiedCategories = `${chosenCategories} ${categoryName}`;
    } else {
      console.log('removing');
      modifiedCategories = _.replace(chosenCategories, categoryName, '');
    }

    modifiedCategories = _.replace(modifiedCategories, '  ', ' ');

    await firebase.update(`/users/${this.props.auth.uid}`, { favoriteCategories: modifiedCategories });

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
    return <div />;
  }

  render() {
    const { profile } = this.props;
    const allInfoNotEntered = isLoaded(profile) && (!profile.lastName || !profile.firstName || !profile.email);
    const profileAllGood = isLoaded(profile) && profile.lastName && profile.firstName && profile.email && profile.acceptedPrivacyPolicy;

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
  categories: PropTypes.object,
};
