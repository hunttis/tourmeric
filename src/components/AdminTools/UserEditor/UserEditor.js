import React, { Component, Fragment } from 'react';
import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import UserEntry from './UserEntry-container';
import { DisableModal } from './DisableModal';
import { EditModal } from './EditModal';
import CreditModal from './CreditModal-container';
import { setListener } from '../../Common/DocumentUtils';

export default class UserEditor extends Component {

  constructor(props) {
    super(props);
    this.searchUsers.bind(this.searchUsers);
    this.escFunction = this.escFunction.bind(this);

    this.state = {
      searchingWith: '',
      searchLetter: '',
      searchPhrase: '',
      modalOpenClass: '',
      modalUser: '',
      modalMode: '',
      parseReady: false,
      showOnlyEnabledUsers: true,
    };
  }

  componentDidMount = () => {
    setListener('keydown', this.escFunction);
  }

  getUser(userid) {
    if (!userid) {
      return null;
    }
    const { users } = this.props;
    const foundUser = _.find(users, { key: userid });
    return foundUser;
  }

  escFunction(event) {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  }

  parseAlphabetFromUsers() {
    const alphabet = isLoaded(this.props.users) && _.compact(_.uniq(Object.values(this.props.users).map((user) => {
      if (user.value.lastName && !_.isEmpty(user.value.lastName)) {
        return user.value.lastName.substring(0, 1).toUpperCase();
      }
      return null;
    })));
    return alphabet;
  }

  searchByAlphabet(searchLetter) {

    if (_.isEmpty(searchLetter)) {
      this.resetSearches();
    }

    if (!_.isEmpty(searchLetter)) {
      this.setState({ searchingWith: 'letter', searchPhrase: '', searchLetter });
    }
  }

  searchUsers(event) {
    const searchPhrase = event.target.value;

    if (_.isEmpty(searchPhrase)) {
      this.resetSearches();
    }

    if (!_.isEmpty(searchPhrase)) {
      this.setState({ searchingWith: 'phrase', searchPhrase, searchLetter: '' });
    }
  }

  resetSearches() {
    const alphabet = this.parseAlphabetFromUsers();
    this.setState({ searchingWith: 'letter', searchPhrase: '', searchLetter: alphabet[0] });
  }

  filterUsers() {
    const { users } = this.props;
    const { searchPhrase, searchLetter, searchingWith, showOnlyEnabledUsers } = this.state;
    let filtered = Object.values(users);
    if (searchingWith === 'phrase') {
      filtered = Object.values(users).filter((userEntry) => {
        const user = userEntry.value;
        return (user.email && user.email.toLowerCase().indexOf(searchPhrase) !== -1) ||
          (user.displayName && user.displayName.toLowerCase().indexOf(searchPhrase) !== -1) ||
          (user.username && user.username.toLowerCase().indexOf(searchPhrase) !== -1) ||
          (user.firstName && user.firstName.toLowerCase().indexOf(searchPhrase) !== -1) ||
          (user.lastName && user.lastName.toLowerCase().indexOf(searchPhrase) !== -1);
      });
    }

    if (searchingWith === 'letter') {
      filtered = Object.values(users).filter((userEntry) => {
        const user = userEntry.value;
        return user.lastName && user.lastName.toLowerCase().startsWith(searchLetter.toLowerCase());
      });
    }

    if (showOnlyEnabledUsers) {
      filtered = filtered.filter(user => user.value.active !== false);
    }

    return filtered;
  }

  openEditModal(userid) {
    this.setState({ modalUser: userid, modalMode: 'edit', modalOpenClass: 'is-active' });
  }

  openCreditModal(userid) {
    this.setState({ modalUser: userid, modalMode: 'credit', modalOpenClass: 'is-active' });
  }

  openDisableModal(userid) {
    this.setState({ modalUser: userid, modalMode: 'disable', modalOpenClass: 'is-active' });
  }

  closeModal() {
    this.setState({ modalUser: '', modalMode: '', modalOpenClass: '' });
  }

  filterInfoString() {
    const { searchPhrase, searchLetter, searchingWith } = this.state;

    if (searchingWith === 'letter') {
      return (
        <Fragment>
          <Translate id="searchinglastnamesstartingwith" />&nbsp;<span className="has-text-success">{searchLetter}</span>
        </Fragment>
      );
    }
    if (searchingWith === 'phrase') {
      return (
        <Fragment>
          <Translate id="searchingfirstnamelastnameemailbyphrase" />&nbsp;<span className="has-text-success">{searchPhrase}</span>
        </Fragment>
      );
    }
    return <Translate id="showingallusers" />;
  }

  render() {
    const { users, storecredit } = this.props;
    const { modalOpenClass, modalUser, modalMode } = this.state;

    if (!isLoaded(users)) {
      return <Fragment><Translate id="loading" /></Fragment>;
    }
    if (isLoaded(users) && !this.state.parseReady) {
      const currentAlphabet = this.parseAlphabetFromUsers();
      this.setState({ parseReady: true, searchingWith: 'letter', searchLetter: currentAlphabet[0] });
      return <Fragment><Translate id="loading" /></Fragment>;
    }
    if (isLoaded(users) && isLoaded(storecredit)) {
      const currentUser = this.getUser(modalUser);
      const userId = currentUser ? currentUser.key : '';
      const userData = currentUser ? currentUser.value : {};
      const usedList = this.filterUsers();
      const alphabet = this.parseAlphabetFromUsers();

      return (
        <Fragment>
          <div className={`modal ${modalOpenClass}`}>
            <div className="modal-background" onClick={() => this.closeModal()} />
            <div className="modal-content">
              {modalMode === 'edit' && <EditModal userId={userId} userData={userData} />}
              {modalMode === 'credit' && <CreditModal userId={userId} />}
              {modalMode === 'disable' && <DisableModal userId={userId} userData={userData} />}
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={() => this.closeModal()} />
          </div>
          <div className="level">

            <div className="level-left">
              <div className="field">
                <div className="field-label is-normal">
                  <label className="label"><Translate id="filterlastname" /></label>
                </div>
                <div className="field-body">
                  {alphabet.map((letter, index) => (

                    <button
                      onClick={() => this.searchByAlphabet(letter)}
                      className={`button is-grouped is-small ${this.state.searchLetter === letter && 'is-success'}`}
                      key={`letterSearch-${index}`}
                    >{letter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="level-item">
              <div className="field">
                <div className="field-label has-text-left">
                  <label className="label"><Translate id="textsearch" /></label>
                </div>
                <div className="field-body">
                  <input className="input" type="text" onChange={event => this.searchUsers(event)} />
                </div>
              </div>
            </div>
            <div className="level-right">
              <Fragment>{users.length} <Translate id="usersintotal" /></Fragment>
              <br />
              {(usedList.length !== users.length) && <Fragment>{usedList.length} <Translate id="hitswithsearch" /></Fragment>}
            </div>
          </div>
          <h2 className="subtitle">
            {this.filterInfoString()}
          </h2>
          <div className="columns is-multiline">
            {usedList.map(userEntry => (<UserEntry
              key={userEntry.key}
              userId={userEntry.key}
              openEditModal={() => this.openEditModal(userEntry.key)}
              openCreditModal={() => this.openCreditModal(userEntry.key)}
              openDisableModal={() => this.openDisableModal(userEntry.key)}
              userData={userEntry.value}
            />)) }
          </div>
        </Fragment>
      );
    }
    return <div><Translate id="loading" /></div>;
  }
}

UserEditor.propTypes = {
  users: PropTypes.array,
  storecredit: PropTypes.object,
};
