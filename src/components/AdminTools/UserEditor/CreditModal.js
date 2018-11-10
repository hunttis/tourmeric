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
    creditCategory: '',
  };

  changeCreditNote = (event) => {
    this.setState({ creditFormNote: event.target.value });
  }

  changeCreditAmount(event) {
    this.setState({ creditFormAmount: event.target.value });
  }

  saveCredit(userId, note, amount, category) {
    const storedObject = { creditAddedBy: firebase.auth().currentUser.uid, creditAddedByName: firebase.auth().currentUser.displayName, date: new Date().toUTCString(), note, value: Number.parseFloat(amount), category };
    firebase.push(`/storecredit/${userId}`, storedObject);
    this.setState({ creditFormNote: '', creditFormAmount: 0.0 });
  }

  parseMappedColor(categoryName) {
    switch (categoryName) {
      case 'green':
        return 'success';
      case 'red':
        return 'danger';
      case 'yellow':
        return 'warning';
      case 'blue':
        return 'info';
      default:
        return 'white';
    }
  }

  render() {
    const { userId, storecredit, storecreditcategories } = this.props;

    if (isLoaded(storecredit) && isLoaded(storecreditcategories)) {
      const userCreditData = storecredit ? storecredit[userId] : {};

      return (
        <Fragment>
          <div className="box">
            {userCreditData &&
              <StoreCreditTable key={userId} userId={userId} creditData={userCreditData} />
            }
          </div>
          <div className="box">
            <h2 className="subtitle"><Translate id="newcreditrow" /></h2>
            <div className="field">
              <label className="label"><Translate id="note" /></label>
              <Translate>
                {translate => (
                  <input className="input" type="text" value={this.state.creditFormNote} placeholder={translate('creditmessage')} onChange={event => this.changeCreditNote(event)} />
                )}
              </Translate>
            </div>
            <div className="field">
              <label className="label"><Translate id="creditamount" /></label>
              <Translate>
                {translate => (
                  <input className="input" type="number" value={this.state.creditFormAmount} placeholder={translate('creditamount')} onChange={event => this.changeCreditAmount(event)} />
                )}
              </Translate>
            </div>
            <div className="field">
              <label className="label"><Translate id="itemcategory" /></label>
              <button className={`button is-white ${this.state.creditCategory !== '' && 'is-outlined'}`} onClick={() => { this.setState({ creditCategory: '' }); }}><Translate id="none" /></button>
              {storecreditcategories && Object.entries(storecreditcategories).map((categoryEntry, index) => {
                const mappedColor = this.parseMappedColor(categoryEntry[0]);
                const categoryName = categoryEntry[1];
                return <button key={`categorybutton-${index}`} className={`button is-${mappedColor} ${this.state.creditCategory !== mappedColor && 'is-outlined'}`} onClick={() => { this.setState({ creditCategory: mappedColor }); }}>{categoryName}</button>;
              })}
            </div>
            <div>
              <button className="button is-primary" disabled={this.state.creditFormAmount === 0 || this.state.creditFormNote.length === 0} onClick={() => this.saveCredit(userId, this.state.creditFormNote, this.state.creditFormAmount, this.state.creditCategory)}><Translate id="save" /></button>
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
  storecreditcategories: PropTypes.object,
};
