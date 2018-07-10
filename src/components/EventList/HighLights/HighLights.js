import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class HighLights extends Component {

  constructor(props) {
    super(props);
    this.state = { foo: true };
  }

  render() {
    return (
      <Fragment>
        <figure className="image">
          <img alt="" src="https://firebasestorage.googleapis.com/v0/b/omg-tournament-test.appspot.com/o/uploadedCategoryLogos%2Fomg01-2.jpg?alt=media&token=723eaa6d-5f37-4a89-933d-94d4b88e72d6" />
        </figure>
      </Fragment>);
  }

}
