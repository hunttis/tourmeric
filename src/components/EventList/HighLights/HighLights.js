import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { isLoaded, isEmpty } from 'react-redux-firebase';

export default class HighLights extends Component {

  constructor(props) {
    super(props);
    this.state = { currentlyShowing: '', currentlyShowingIndex: 0 };
  }

  componentDidMount() {
    this.activateNext();
  }

  componentWillUnmount() {
    this.timeout = null;
  }

  activateNext() {
    const { highlights } = this.props;

    if (isLoaded(highlights)) {
      const nextIndex = (this.state.currentlyShowingIndex + 1) % Object.keys(highlights).length;
      const nextKey = Object.keys(highlights)[nextIndex];
      this.setState({ currentlyShowing: nextKey, currentlyShowingIndex: nextIndex });
    }
    this.timeout = setTimeout(() => this.activateNext(), 5000);
  }

  render() {
    const { highlights } = this.props;

    if (isLoaded(highlights) && !isEmpty(highlights)) {

      if (this.state.currentlyShowing) {
        const highlightId = this.state.currentlyShowing;
        const highlight = highlights[highlightId];

        return (
          <Fragment>

            <div className="highlights fadeIn">
              <figure key={highlightId} className="image is-background">
                <img alt="" src={highlight.image} />
              </figure>
            </div>

          </Fragment>
        );
      }
    }
    return <div><Translate id="loading" /></div>;

  }
}

HighLights.propTypes = {
  highlights: PropTypes.object,
};
