import React, { Component } from 'react';
import { isLoaded } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';
import StoreCreditTable from '../StoreCredit/StoreCreditTable-container';
import { TourmericStoreCreditData, StoreCreditCategory } from '~/models/StoreCredit';

interface Props {
  userId: string;
  storecredit: { [key: string]: { [key: string]: TourmericStoreCreditData } };
  storecreditcategories: { [key: string]: StoreCreditCategory };
}

interface State {
  creditFormAmount: number;
  creditFormNote: string;
  creditCategory: string;
}

export default class CreditModal extends Component<Props, State> {

  state = {
    creditFormAmount: 0.0,
    creditFormNote: '',
    creditCategory: 'white',
  };

  changeCreditNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ creditFormNote: event.target.value });
  }

  changeCreditAmount(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ creditFormAmount: event.target.value as unknown as number });
  }

  saveCredit(userId: string, note: string, amount: string, category: string) {
    const storedObject = { creditAddedBy: firebase.auth().currentUser!.uid, creditAddedByName: firebase.auth().currentUser!.displayName, date: new Date().toUTCString(), note, value: Number.parseFloat(amount), category };
    firebase.push(`/storecredit/${userId}`, storedObject);
    this.setState({ creditFormNote: '', creditFormAmount: 0.0 });
  }

  parseMappedColor(categoryName: string) {
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
        <>
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
                {(translate: any) => (
                  <input className="input" type="text" value={this.state.creditFormNote} placeholder={translate('creditmessage')} onChange={(event) => this.changeCreditNote(event)} />
                )}
              </Translate>
            </div>
            <div className="field">
              <label className="label"><Translate id="creditamount" /></label>
              <Translate>
                {(translate: any) => (
                  <input className="input" type="number" value={this.state.creditFormAmount} placeholder={translate('creditamount')} onChange={(event) => this.changeCreditAmount(event)} />
                )}
              </Translate>
            </div>
            <div className="field">
              <label className="label"><Translate id="itemcategory" /></label>
              <button className={`button is-white ${this.state.creditCategory !== '' && 'is-outlined'}`} onClick={() => { this.setState({ creditCategory: 'white' }); }}><Translate id="none" /></button>
              {storecreditcategories && Object.entries(storecreditcategories).map((categoryEntry, index) => {
                const categoryColor = categoryEntry[0];
                const mappedColor = this.parseMappedColor(categoryEntry[0]);
                const categoryName = categoryEntry[1];
                return <button key={`categorybutton-${index}`} className={`button is-${mappedColor} ${this.state.creditCategory !== mappedColor && 'is-outlined'}`} onClick={() => { this.setState({ creditCategory: categoryColor }); }}>{categoryName}</button>;
              })}
            </div>
            <div>
              <button
                className="button is-primary"
                disabled={this.state.creditFormAmount === 0 || this.state.creditFormNote.length === 0}
                onClick={() => this.saveCredit(userId, this.state.creditFormNote, `${this.state.creditFormAmount}`, this.state.creditCategory)}
              >
                <Translate id="save" />
              </button>
            </div>
          </div>
        </>
      );
    }
    return <div><Translate id="loading" /></div>;

  }
}
