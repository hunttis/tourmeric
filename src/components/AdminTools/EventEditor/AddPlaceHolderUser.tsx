import React, { Component } from 'react';
import { FormattedMessage, IntlShape } from "react-intl";

import { adminparticipate } from '../../../api/eventApi';
import { User } from '../../../models/ReduxState';

interface Props {
  eventId: string;
  isAdmin: boolean;
  intl: IntlShape;
}

interface State {
  firstName: string;
  lastName: string;
}

export class AddPlaceHolderUser extends Component<Props, State> {

  savePlaceholderuser() {
    const { firstName, lastName } = this.state;
    const { eventId, intl } = this.props;
    const userData: User = { firstName, lastName, avatarUrl: '', active: true, email: '', username: '' };
    const fakeUser = { key: `placeholder-${Math.round(Math.random() * 1000)}`, value: userData };
    adminparticipate(eventId, fakeUser);
  }

  render() {
    return (
      <div className="columns is-multiline">
        <div className="column is-12">
          <h2 className="subtitle"><FormattedMessage id="addplaceholderuser" /></h2>
        </div>
        
          
            <>
              <div className="column is-5">
                <div className="field">
                  <div className="field-label">
                    <div className="control">
                      <label className="label"><FormattedMessage id="firstname" /></label>
                    </div>
                  </div>
                  <div className="field-body">
                    <input className="input" placeholder={`${intl.formatMessage({id: 'firstname'})}`} onChange={(change) => { this.setState({ firstName: change.target.value }); }} />
                  </div>
                </div>
              </div>
              <div className="column is-5">
                <div className="field">
                  <div className="field-label">
                    <div className="control">
                      <label className="label"><FormattedMessage id="lastname" /></label>
                    </div>
                  </div>
                  <div className="field-body">
                    <input className="input" placeholder={`${intl.formatMessage({id: 'lastname'})}`} onChange={(change) => { this.setState({ lastName: change.target.value }); }} />
                  </div>
                </div>
              </div>
              <div className="column is-2">
                <div className="field">
                  <div className="field-label">
                    <div className="control">
                      <label className="label">&nbsp;</label>
                    </div>
                  </div>
                  <div className="field-body">
                    <button className="button is-success is-outlined" onClick={() => this.savePlaceholderuser()}><FormattedMessage id="add" /></button>
                  </div>
                </div>
              </div>
            </>
        

      </div>
    );
  }
}
