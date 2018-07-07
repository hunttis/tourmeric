import React, { Component, Fragment } from 'react';
import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';
import UserEntry from './UserEntry-container';
import EditableField from '../../Common/EditableField-container';
import StoreCreditTable from '../StoreCredit/StoreCreditTable-container';

export default class UserEditor extends Component {

  constructor(props) {
    super(props);
    this.searchUsers.bind(this.searchUsers);
    this.escFunction = this.escFunction.bind(this);
  }

  state = {
    filteredUsers: [],
    modalOpenClass: '',
    modalUser: '',
    modalMode: '',
    creditFormAmount: 0.0,
    creditFormNote: '',
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
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

  searchUsers(event) {
    const { users } = this.props;
    const searchString = event.target.value;
    if (_.isEmpty(searchString)) {
      this.setState({ filteredUsers: [] });
    } else {
      const filtered = Object.values(users).filter((userEntry) => {
        const user = userEntry.value;
        return (user.email && user.email.toLowerCase().indexOf(searchString) !== -1) ||
          (user.displayName && user.displayName.toLowerCase().indexOf(searchString) !== -1) ||
          (user.username && user.username.toLowerCase().indexOf(searchString) !== -1);
      });
      this.setState({ filteredUsers: filtered });
    }
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
    this.setState({ modalUser: '', modalMode: '', modalOpenClass: '', creditFormAmount: '', creditFormNote: '' });
  }

  disableUser(userId) {
    firebase.update(`/users/${userId}`, { active: false });
  }

  calculateTotal(creditData) {
    let total = 0.0;
    if (creditData[1]) {
      for (const dataItem of Object.values(creditData[1])) {
        total += dataItem.value;
      }
    }
    return total;
  }

  changeCreditNote(event) {
    this.setState({ creditFormNote: event.target.value });
  }

  changeCreditAmount(event) {
    this.setState({ creditFormAmount: event.target.value });
  }

  saveCredit(userId, note, amount) {
    const storedObject = { creditAddedBy: firebase.auth().currentUser.uid, date: new Date().toUTCString(), note, value: Number.parseFloat(amount) };
    firebase.push(`/storecredit/${userId}`, storedObject);
    this.setState({ creditFormNote: '', creditFormAmount: 0.0 });
  }

  renderEditModal(userId, userData) {
    return (
      <Fragment>
        <div className="box">
          <EditableField
            defaultValue={userData.displayName}
            labelContent="shownname"
            placeHolder="exampleshownname"
            path={`/users/${userId}`}
            targetName="displayName"
          />

          <EditableField
            defaultValue={userData.email}
            labelContent="email"
            placeHolder="exampleemail"
            path={`/users/${userId}`}
            targetName="email"
          />

          <EditableField
            defaultValue={userData.avatarUrl}
            labelContent="avatarurl"
            placeHolder="avatar image url"
            path={`/users/${userId}`}
            targetName="avatarURL"
          />

          <EditableField
            defaultValue={userData.username}
            labelContent="username"
            placeHolder="username"
            path={`/users/${userId}`}
            targetName="username"
          />

          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label"><Translate id="role" /></label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control is-expanded">
                  <div className="select">
                    <select
                      defaultValue={userData.role}
                      onChange={event => firebase.update(`/users/${userId}`, { role: event.target.value })}
                    >
                      <option value={null}><Translate id="select" /></option>
                      <option value="user"><Translate id="roleuser" /></option>
                      <option value="admin"><Translate id="roleadmin" /></option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }

  renderCreditModal(userId, storecredit) {
    const userCreditData = storecredit[userId];
    return (
      <Fragment>
        {userCreditData &&
          <StoreCreditTable key={userId} userId={userId} creditData={userCreditData} />
        }
        <div className="level">

          <div className="level-left">
            <div className="field">
              <label className="label">Note</label>
              <input className="input" type="text" defaultValue={this.state.creditFormNote} placeholder="Credit change note" onChange={event => this.changeCreditNote(event)} />
            </div>
          </div>
          <div className="level-item">
            <div className="field">
              <label className="label">Credit Amount</label>
              <input className="input" type="number" defaultValue={this.state.creditFormAmount} placeholder="Credit amount" onChange={event => this.changeCreditAmount(event)} />
            </div>
          </div>
          <div>
            <button className="button is-primary" onClick={() => this.saveCredit(this.state.modalUser, this.state.creditFormNote, this.state.creditFormAmount)}>Save</button>
          </div>
        </div>
      </Fragment>
    );
  }

  renderDisableModal(userId, userData) {
    return (
      <Fragment>

        <div className="box">
          <h1 className="title"><Translate id="disablethisuser" /></h1>
          <ul>
            {userData.displayName &&
              <li><Translate id="displayname" />: {userData.displayName}</li>
            }
            {userData.username &&
              <li><Translate id="username" />: {userData.username}</li>
            }
            <li><Translate id="email" />: {userData.email}</li>
            {userData.avatarUrl &&
              <li><Translate id="avatarurl" />:&nbsp;
                <a target="_blank" rel="noopener noreferrer" href={userData.avatarUrl}>{userData.avatarUrl.substr(0, 20)}...</a>
              </li>
            }
            {userData.dciNumber &&
              <li><Translate id="dcinumber" />: {userData.dciNumber}</li>
            }
          </ul>
          <hr />
          <div className="level">
            <div className="level-item">
              <button className="button is-danger is-small" onClick={() => this.disableUser(userId)}>Yes</button>
              <button className="button is-primary is-large">No</button>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }

  render() {
    const { users, storecredit } = this.props;
    const { filteredUsers, modalOpenClass, modalUser, modalMode } = this.state;

    if (isLoaded(users) && isLoaded(storecredit)) {
      const currentUser = this.getUser(modalUser);
      const userId = currentUser ? currentUser.key : '';
      const userData = currentUser ? currentUser.value : {};
      const usedList = _.isEmpty(filteredUsers) ? Object.values(users) : filteredUsers;
      return (
        <Fragment>
          <div className={`modal ${modalOpenClass}`}>
            <div className="modal-background" onClick={() => this.closeModal()} />
            <div className="modal-content">
              {modalMode === 'edit' && this.renderEditModal(userId, userData)}
              {modalMode === 'credit' && this.renderCreditModal(userId, storecredit)}
              {modalMode === 'disable' && this.renderDisableModal(userId, userData)}
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={() => this.closeModal()} />
          </div>
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <input className="input" type="text" placeholder="Search users" onChange={event => this.searchUsers(event)} />
              </div>
              <div className="level-item">
                {!_.isEmpty(filteredUsers) && `${filteredUsers.length} hits with search`}
                {_.isEmpty(filteredUsers) && `${users.length} users in total`}
              </div>
            </div>
            <div className="level-right">
              {/* <div className="button" onClick={this.minimizeOpenedUsers} ><Translate id="minimizeall" />
              </div> */}
            </div>
          </div>
          <div className="columns is-multiline">
            {usedList.map((userEntry) => {
              const result = Object.entries(storecredit).filter((storecreditEntry) => {
                const creditId = storecreditEntry[0];
                return creditId === userEntry.key;
              });
              const total = _.isEmpty(result) ? 0 : this.calculateTotal(result[0]);

              return (<UserEntry
                key={userEntry.key}
                openEditModal={() => this.openEditModal(userEntry.key)}
                openCreditModal={() => this.openCreditModal(userEntry.key)}
                openDisableModal={() => this.openDisableModal(userEntry.key)}
                userData={userEntry.value}
                creditAmount={Number.parseFloat(total)}
              />);
            }) };
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
