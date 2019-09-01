import React from 'react';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';
import EditableField from '../../Common/EditableField-container';
import { User } from '~/models/ReduxState';

interface Props {
  userId: string | undefined;
  userData: User | undefined;
}

export const EditModal = ({ userId, userData }: Props) => (
  <>
    <div className="box">
      <EditableField
        defaultValue={userData && userData.displayName}
        labelContent="shownname"
        placeHolder="exampleshownname"
        path={`/users/${userId}`}
        targetName="displayName"
      />

      <EditableField
        defaultValue={userData && userData.firstName}
        labelContent="firstname"
        placeHolder="firstname"
        path={`/users/${userId}`}
        targetName="firstName"
      />

      <EditableField
        defaultValue={userData && userData.lastName}
        labelContent="lastname"
        placeHolder="lastname"
        path={`/users/${userId}`}
        targetName="lastName"
      />

      <EditableField
        defaultValue={userData && userData.email}
        labelContent="email"
        placeHolder="exampleemail"
        path={`/users/${userId}`}
        targetName="email"
      />

      <EditableField
        defaultValue={userData && userData.avatarUrl}
        labelContent="avatarurl"
        placeHolder="avatar image url"
        path={`/users/${userId}`}
        targetName="avatarURL"
      />

      <EditableField
        defaultValue={userData && userData.username}
        labelContent="username"
        placeHolder="username"
        path={`/users/${userId}`}
        targetName="username"
      />

      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">
            <Translate id="role" />
          </label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control is-expanded">
              <div className="select">
                <Translate>
                  {(translate: any) => (
                    <select
                      defaultValue={userData && userData.role}
                      onChange={(event) => firebase.update(`/users/${userId}`, {
                        role: event.target.value,
                      })
                      }
                    >
                      <option value={undefined}>{translate('select')}</option>
                      <option value="user">{translate('roleuser')}</option>
                      <option value="admin">{translate('roleadmin')}</option>
                    </select>
                  )}
                </Translate>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
