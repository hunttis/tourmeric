import React, { Component } from 'react';
import { isLoaded } from 'react-redux-firebase';
import _ from 'lodash';
import { FormattedMessage, IntlShape } from "react-intl";
import UserEntry from './UserEntry-container';
import { DisableModal } from './DisableModal';
import { EditModal } from './EditModal';
import CreditModal from './CreditModal-container';
import { setListener } from '../../Common/DocumentUtils';
import { User } from '../../../models/ReduxState';
import { TourmericStoreCreditData } from '../../../models/StoreCredit';
import { parseStartingLettersFromUserLastnames } from '../../Common/UserUtils';

interface Props {
  users: [{ key: string, value: User }];
  storecredit: { [key: string]: { [key: string]: TourmericStoreCreditData } };
}

interface State {
  searchingWith: string;
  searchLetter: string;
  searchPhrase: string;
  modalOpenClass: string;
  modalUser: string;
  modalMode: string;
  showOnlyEnabledUsers: boolean;
}

export default class UserEditor extends Component<Props, State> {

  constructor(props: Props) {
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
      showOnlyEnabledUsers: true,
    };
  }

  componentDidMount = () => {
    setListener('keydown', this.escFunction);
  }

  static getDerivedStateFromProps = (nextProps: Props, prevState: State) => {
    if (prevState.searchingWith === '' && isLoaded(nextProps.users)) {
      const alphabet: string[] = parseStartingLettersFromUserLastnames(nextProps.users);
      return { searchingWith: 'letter', searchLetter: alphabet[0] };
    }
    return null;
  }

  getUser(userid: string) {
    if (!userid) {
      return null;
    }
    const { users } = this.props;
    const foundUser = _.find(users, { key: userid });
    return foundUser;
  }

  escFunction(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  }

  searchByAlphabet(searchLetter: string) {

    if (_.isEmpty(searchLetter)) {
      this.resetSearches();
    }

    if (!_.isEmpty(searchLetter)) {
      this.setState({ searchingWith: 'letter', searchPhrase: '', searchLetter });
    }
  }

  searchUsers(event: React.ChangeEvent<HTMLInputElement>) {
    const searchPhrase = event.target.value;

    if (_.isEmpty(searchPhrase)) {
      this.resetSearches();
    }

    if (!_.isEmpty(searchPhrase)) {
      this.setState({ searchingWith: 'phrase', searchPhrase, searchLetter: '' });
    }
  }

  resetSearches() {
    const alphabet = parseStartingLettersFromUserLastnames(this.props.users);
    this.setState({ searchingWith: 'letter', searchPhrase: '', searchLetter: alphabet[0] });
  }

  filterUsers() {
    const { users } = this.props;
    const { searchPhrase, searchLetter, searchingWith, showOnlyEnabledUsers } = this.state;
    let filtered = Object.values(users);
    if (searchingWith === 'phrase') {
      filtered = Object.values(users).filter((userEntry) => {
        const user = userEntry.value;
        return (user.email && user.email.toLowerCase().indexOf(searchPhrase.toLowerCase()) !== -1) ||
          (user && user.displayName && user.displayName.toLowerCase().indexOf(searchPhrase.toLowerCase()) !== -1) ||
          (user && user.username && user.username.toLowerCase().indexOf(searchPhrase.toLowerCase()) !== -1) ||
          (user && user.firstName && user.firstName.toLowerCase().indexOf(searchPhrase.toLowerCase()) !== -1) ||
          (user && user.lastName && user.lastName.toLowerCase().indexOf(searchPhrase.toLowerCase()) !== -1);
      });
    }

    if (searchingWith === 'letter') {
      filtered = Object.values(users).filter((userEntry) => {
        const user = userEntry.value;
        return user.lastName && user.lastName.toLowerCase().startsWith(searchLetter.toLowerCase());
      });
    }

    if (showOnlyEnabledUsers) {
      filtered = filtered.filter((user) => user.value.active !== false);
    }

    return filtered;
  }

  openEditModal(userid: string) {
    this.setState({ modalUser: userid, modalMode: 'edit', modalOpenClass: 'is-active' });
  }

  openCreditModal(userid: string) {
    this.setState({ modalUser: userid, modalMode: 'credit', modalOpenClass: 'is-active' });
  }

  openDisableModal(userid: string) {
    this.setState({ modalUser: userid, modalMode: 'disable', modalOpenClass: 'is-active' });
  }

  closeModal() {
    this.setState({ modalUser: '', modalMode: '', modalOpenClass: '' });
  }

  filterInfoString() {
    const { searchPhrase, searchLetter, searchingWith } = this.state;

    if (searchingWith === 'letter') {
      return (
        <>
          <FormattedMessage id="searchinglastnamesstartingwith" />&nbsp;<span className="has-text-success">{searchLetter}</span>
        </>
      );
    }
    if (searchingWith === 'phrase') {
      return (
        <>
          <FormattedMessage id="searchingfirstnamelastnameemailbyphrase" />&nbsp;<span className="has-text-success">{searchPhrase}</span>
        </>
      );
    }
    return <FormattedMessage id="showingallusers" />;
  }

  render() {
    const { users, storecredit } = this.props;
    const { modalOpenClass, modalUser, modalMode } = this.state;

    if (!isLoaded(users) || !isLoaded(storecredit)) {
      return <><FormattedMessage id="loading" /></>;
    }

    const currentUser = this.getUser(modalUser);

    const userId = _.get(currentUser, 'key');
    const userData = _.get(currentUser, 'value');
    const userList = this.filterUsers();
    const alphabet = parseStartingLettersFromUserLastnames(users);

    return (
      <>
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
                <label className="label"><FormattedMessage id="filterlastname" /></label>
              </div>
              <div className="field-body">
                {alphabet.map((letter: string, index: number) => (

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
                <label className="label"><FormattedMessage id="textsearch" /></label>
              </div>
              <div className="field-body">
                <input className="input" type="text" onChange={(event) => this.searchUsers(event)} />
              </div>
            </div>
          </div>
          <div className="level-right">
            <>{users.length} <FormattedMessage id="usersintotal" /></>
            <br />
            {(userList.length !== users.length) && <>{userList.length} <FormattedMessage id="hitswithsearch" /></>}
          </div>
        </div>
        <h2 className="subtitle">
          {this.filterInfoString()}
        </h2>
        <div className="columns is-multiline">
          {userList.map((userEntry) => (<UserEntry
            key={userEntry.key}
            userId={userEntry.key}
            openEditModal={() => this.openEditModal(userEntry.key)}
            openCreditModal={() => this.openCreditModal(userEntry.key)}
            openDisableModal={() => this.openDisableModal(userEntry.key)}
            userData={userEntry.value}
          />))}
        </div>
      </>
    );

  }
}
