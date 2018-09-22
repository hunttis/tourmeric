import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';

export const UserEntry = ({ openEditModal, openCreditModal, openDisableModal, userData, creditAmount }) => (
  <div className="userentry column is-half is-one-third-desktop is-one-third-widescreen is-one-quarter-fullhd">
    <div className="card">

      <div className="card-header">
        <div className="card-header-title">
          {userData.firstName} {userData.lastName} - {userData.email}
        </div>
        {userData.avatarUrl &&
        <div className="card-header-icon">
          <figure className="image is-48x48">
            <img src={userData.avatarUrl} alt="User avatar" />
          </figure>
        </div>
      }
      </div>

      <div className="card-content">
        <ul>
          {userData.firstName &&
            <li><Translate id="firstname" />: {userData.firstName}</li>
          }
          {userData.lastName &&
            <li><Translate id="lastname" />: {userData.lastName}</li>
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
          <li><Translate id="storecredit" />: <span className="has-text-success">{creditAmount} €</span></li>
        </ul>
      </div>
      <div className="card-footer">
        <div className="card-footer-item button is-primary" onClick={openEditModal}>
          <Translate id="edit" />
        </div>
        <div className="card-footer-item button is-info" onClick={openCreditModal}>
          <Translate id="storecredit" />
        </div>
        <div className="card-footer-item button is-danger" onClick={openDisableModal}>
          <Translate id="delete" />
        </div>
      </div>
    </div>
  </div>
);

UserEntry.propTypes = {
  openEditModal: PropTypes.func,
  openDisableModal: PropTypes.func,
  openCreditModal: PropTypes.func,
  userData: PropTypes.object,
  creditAmount: PropTypes.number,
};
