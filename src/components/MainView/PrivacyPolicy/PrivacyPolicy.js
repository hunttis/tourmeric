import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';


export default class PrivacyPolicy extends Component {

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
      <Fragment>

        <div key="privacyPolicyModal" className={`modal ${shouldModalBeOpen}`}>
          <div className="modal-background" onClick={() => this.closeModal()} />
          <div className="modal-content">
            <div className="box has-text-justified">
              {!_.isEmpty(privacyPolicyContent) && privacyPolicyContent.split('\n').map((paragraph, index) => <p key={`privacyPolicy-${index}`}>{paragraph}</p>)}
            </div>
            {showAcceptance &&
              <div className="button">
                <Translate id="accept" />
              </div>
            }
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => this.closeModal()} />
        </div>


        <button className="button" onClick={() => this.openModal()}>
          <Translate id="privacypolicy" />
        </button>
      </Fragment>
    );
  }

}

PrivacyPolicy.propTypes = {
  settings: PropTypes.object.isRequired,
  showAcceptance: PropTypes.bool.isRequired,
  openModalOnly: PropTypes.bool,
};
