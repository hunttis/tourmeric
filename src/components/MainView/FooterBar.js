import React, { Component } from 'react';

import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy-container';

export default class FooterBar extends Component {

  foo() {}

  render() {

    return (
      <footer className="footer">
        <div className="content">

          <div className="level">
            <div className="level-item" />
            <div className="level-right">
              <PrivacyPolicy showAcceptance={false} />
            </div>
          </div>
        </div>
      </footer>
    );
  }

}

FooterBar.propTypes = {
};
