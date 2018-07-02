import React, { Component, Fragment } from 'react';
import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase';
import UserEntry from './UserEntry-container';
import EditableField from '../../Common/EditableField-container';

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

  openDisableModal(userid) {
    this.setState({ modalUser: userid, modalMode: 'disable', modalOpenClass: 'is-active' });
  }

  closeModal() {
    this.setState({ modalUser: '', modalMode: '', modalOpenClass: '' });
  }

  disableUser(userId) {
    firebase.update(`/users/${userId}`, { active: false });
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

  renderDisableModal(userId, userData) {
    return (
      <Fragment>

        <div className="box">
          <h1 className="title">Disable this user?</h1>
          <ul>
            {userData.displayName &&
              <li>DisplayName: {userData.displayName}</li>
            }
            {userData.username &&
              <li>User name: {userData.username}</li>
            }
            <li>Email: {userData.email}</li>
            {userData.avatarUrl &&
              <li>Avatar URL:&nbsp;
                <a target="_blank" rel="noopener noreferrer" href={userData.avatarUrl}>{userData.avatarUrl.substr(0, 20)}...</a>
              </li>
            }
            {userData.dciNumber &&
              <li>DCI Number: {userData.dciNumber}</li>
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
    const { users } = this.props;
    const { filteredUsers, modalOpenClass, modalUser, modalMode } = this.state;

    const currentUser = this.getUser(modalUser);
    const userId = currentUser ? currentUser.key : '';
    const userData = currentUser ? currentUser.value : {};

    if (isLoaded(users)) {
      const usedList = _.isEmpty(filteredUsers) ? Object.values(users) : filteredUsers;
      return (
        <Fragment>
          <div className={`modal ${modalOpenClass}`}>
            <div className="modal-background" />
            <div className="modal-content">
              {modalMode === 'edit' && this.renderEditModal(userId, userData)}
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
            {usedList.map(userEntry => <UserEntry key={userEntry.key} openEditModal={() => this.openEditModal(userEntry.key)} openDisableModal={() => this.openDisableModal(userEntry.key)} userData={userEntry.value} />)}
          </div>
        </Fragment>
      );
    }
    return <div>Loading</div>;
  }
}

UserEditor.propTypes = {
  users: PropTypes.array,
};
