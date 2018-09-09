import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { isLoaded } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';
import StoreCreditTable from '../StoreCredit/StoreCreditTable-container';

export default class CreditModal extends Component {

  state = {
    creditFormAmount: 0.0,
    creditFormNote: '',
  };

  changeCreditNote = (event) => {
    this.setState({ creditFormNote: event.target.value });
  }

  changeCreditAmount(event) {
    this.setState({ creditFormAmount: event.target.value });
  }

  saveCredit(userId, note, amount) {
    const storedObject = { creditAddedBy: firebase.auth().currentUser.uid, creditAddedByName: firebase.auth().currentUser.displayName, date: new Date().toUTCString(), note, value: Number.parseFloat(amount) };
    firebase.push(`/storecredit/${userId}`, storedObject);
    this.setState({ creditFormNote: '', creditFormAmount: 0.0 });
  }

  render() {
    const { userId, storecredit } = this.props;

    if (isLoaded(storecredit)) {
      const userCreditData = storecredit ? storecredit[userId] : {};
      return (
        <Fragment>
          <div className="box">
            {userCreditData &&
              <StoreCreditTable key={userId} userId={userId} creditData={userCreditData} />
            }
            <div className="level">

              <div className="level-left">
                <div className="field">
                  <label className="label"><Translate id="note" /></label>
                  <Translate>
                    {translate => (
                      <input className="input" type="text" value={this.state.creditFormNote} placeholder={translate('creditmessage')} onChange={event => this.changeCreditNote(event)} />
                    )}
                  </Translate>
                </div>
              </div>
              <div className="level-item">
                <div className="field">
                  <label className="label"><Translate id="creditamount" /></label>
                  <Translate>
                    {translate => (
                      <input className="input" type="number" value={this.state.creditFormAmount} placeholder={translate('creditamount')} onChange={event => this.changeCreditAmount(event)} />
                    )}
                  </Translate>
                </div>
              </div>
              <div>
                <button className="button is-primary" onClick={() => this.saveCredit(userId, this.state.creditFormNote, this.state.creditFormAmount)}><Translate id="save" /></button>
              </div>
            </div>
          </div>
        </Fragment>
      );
    }
    return <div><Translate id="loading" /></div>;

  }
}


CreditModal.propTypes = {
  userId: PropTypes.string,
  storecredit: PropTypes.object,
};
