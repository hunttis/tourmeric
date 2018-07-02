import React from 'react';
import PropTypes from 'prop-types';

export const UserEntry = ({ openEditModal, openDeleteModal, userData }) => (
  <div className="userentry column is-half is-one-third-desktop is-one-third-widescreen is-one-quarter-fullhd">
    <div className="card">

      <div className="card-header">
        <div className="card-header-title">
          {userData.displayName} - {userData.email}
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
          {userData.displayName &&
            <li>DisplayName: {userData.displayName}</li>
          }
          {userData.username &&
            <li>User name: {userData.username}</li>
          }
          <li>Email: {userData.email}</li>
          {userData.avatarUrl &&
            <li>Avatar URL:&nbsp;
              <a target="_blank" href={userData.avatarUrl}>{userData.avatarUrl.substr(0, 20)}...</a>
            </li>
          }
          {userData.dciNumber &&
            <li>DCI Number: {userData.dciNumber}</li>
          }
        </ul>
      </div>
      <div className="card-footer">
        <div className="card-footer-item button is-primary" onClick={openEditModal} >
          Edit
        </div>
        <div className="card-footer-item button is-danger" onClick={openDeleteModal} >
          Delete
        </div>
      </div>
    </div>
  </div>
);

UserEntry.propTypes = {
  openEditModal: PropTypes.func.isRequired,
  openDeleteModal: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
};
