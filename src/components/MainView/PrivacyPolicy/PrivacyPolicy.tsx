import React, { Component } from 'react';
import { FormattedMessage } from "react-intl";
import _ from 'lodash';
import { Settings } from '../../../models/Settings';


interface Props {
  settings: Settings;
  showAcceptance: boolean;
  openModalOnly: boolean;
}

export default class PrivacyPolicy extends Component<Props> {

  state = { modalOpen: '' };

  openModal() {
    this.setState({
      modalOpen: 'is-active',
    });
  }

  closeModal() {
    this.setState({
      modalOpen: '',
    });
  }

  render() {
    const { settings, showAcceptance, openModalOnly } = this.props;
    const shouldModalBeOpen = openModalOnly ? 'is-active' : this.state.modalOpen;
    const privacyPolicyContent = _.get(settings, 'privacyPolicy', '');

    return (
      <>

        <div key="privacyPolicyModal" className={`modal ${shouldModalBeOpen}`}>
          <div className="modal-background" onClick={() => this.closeModal()} />
          <div className="modal-content">
            <div className="box has-text-justified">
              {!_.isEmpty(privacyPolicyContent) && privacyPolicyContent.split('\n').map((paragraph, index) => <p key={`privacyPolicy-${index}`}>{paragraph}</p>)}
            </div>
            {showAcceptance &&
              <div className="button">
                <FormattedMessage id="accept" />
              </div>
            }
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => this.closeModal()} />
        </div>


        <button className="button" onClick={() => this.openModal()}>
          <FormattedMessage id="privacypolicy" />
        </button>
      </>
    );
  }

}
