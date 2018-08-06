import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { isLoaded, isEmpty } from 'react-redux-firebase';

export default class HighLights extends Component {

  constructor(props) {
    super(props);
    this.state = { currentlyShowing: '', currentlyShowingIndex: 0 };
    this.unmounting = false;
  }

  componentDidMount() {
    this.unmounting = false;
    this.activateNext();
  }

  componentWillUnmount() {
    this.unmounting = true;
  }

  activateNext() {
    const { highlights } = this.props;

    if (!this.unmounting) {
      if (isLoaded(highlights)) {
        const activeKeys = Object.entries(highlights).map((highlight) => {
          if (highlight[1].active) {
            return highlight[0];
          }
          return null;
        }).filter(item => item);
        const { currentlyShowingIndex } = this.state;
        const nextIndex = (currentlyShowingIndex + 1) % activeKeys.length;
        const nextKey = activeKeys[nextIndex];
        this.setState({ currentlyShowing: nextKey, currentlyShowingIndex: nextIndex });
      }
      this.timeout = setTimeout(() => this.activateNext(), 10000);
    }
  }

  render() {
    const { highlights } = this.props;

    if (isLoaded(highlights) && !isEmpty(highlights)) {

      if (this.state.currentlyShowing) {
        const highlightId = this.state.currentlyShowing;
        const highlight = highlights[highlightId];

        return (
          <Fragment>

            <div className="highlights fadeIn card">
              <figure className="image is-3by1">
                <img alt="" src={highlight.image} />
              </figure>
            </div>

          </Fragment>
        );
      }
    }

    return (
      <Fragment>
        <div className="highlights fadeIn">
          <figure className="image is-3by1" />
        </div>
      </Fragment>
    );


  }
}

HighLights.propTypes = {
  highlights: PropTypes.object,
};
