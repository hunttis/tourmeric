import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import StoreCreditTable from './StoreCreditTable-container';

export default class StoreCreditEditor extends Component {

  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const { storecredit, users } = this.props;

    if (isLoaded(storecredit) && isLoaded(users) && !isEmpty(storecredit)) {
      return (
        <div>
          <h1 className="title">
            <Translate id="storecredit" />
          </h1>
          {Object.entries(storecredit).map((storecreditEntry) => {
          const creditId = storecreditEntry[0];
          const creditData = storecreditEntry[1];
          return <StoreCreditTable key={creditId} userId={creditId} creditData={creditData} />;
        })}
        </div>
      );
    } else if (!isLoaded(storecredit) || !isLoaded(storecredit)) {
      return <div><Translate id="loading" /></div>;
    }
    return <div><Translate id="nocreditentries" /></div>;

  }
}

StoreCreditEditor.propTypes = {
  users: PropTypes.array,
  storecredit: PropTypes.object,
};
