import React, { Component, Fragment } from 'react';
import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import UserEntry from './UserEntry-container';
import { DisableModal } from './DisableModal';
import { EditModal } from './EditModal';
import CreditModal from './CreditModal-container';

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
          (user.username && user.username.toLowerCase().indexOf(searchString) !== -1) ||
          (user.firstName && user.firstName.toLowerCase().indexOf(searchString) !== -1) ||
          (user.lastName && user.lastName.toLowerCase().indexOf(searchString) !== -1);
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
    this.setState({ modalUser: '', modalMode: '', modalOpenClass: '' });
  }


  calculateTotal(creditData) {
    let total = 0.0;
    for (const dataItem of Object.values(creditData)) {
      total += dataItem.value;
    }
    return total;
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
              {modalMode === 'edit' && <EditModal userId={userId} userData={userData} />}
              {modalMode === 'credit' && <CreditModal userId={userId} />}
              {modalMode === 'disable' && <DisableModal userId={userId} userData={userData} />}
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
              const userCredit = storecredit ? storecredit[userEntry.key] : 0;
              const total = _.isEmpty(userCredit) ? 0 : this.calculateTotal(userCredit);

              return (<UserEntry
                key={userEntry.key}
                openEditModal={() => this.openEditModal(userEntry.key)}
                openCreditModal={() => this.openCreditModal(userEntry.key)}
                openDisableModal={() => this.openDisableModal(userEntry.key)}
                userData={userEntry.value}
                creditAmount={Number.parseFloat(total)}
              />);
            }) }
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
