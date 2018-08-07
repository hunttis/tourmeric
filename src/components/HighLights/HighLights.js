import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';

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
        const activeKeys = this.findActiveKeys(highlights);
        const { currentlyShowingIndex } = this.state;
        const nextIndex = (currentlyShowingIndex + 1) % activeKeys.length;
        const nextKey = activeKeys[nextIndex];
        this.setState({ currentlyShowing: nextKey, currentlyShowingIndex: nextIndex });
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.activateNext(), 10000);
    }
  }

  activateSpecific(specificId) {
    const { highlights } = this.props;

    if (!this.unmounting) {
      if (isLoaded(highlights)) {
        const activeKeys = this.findActiveKeys(highlights);
        const specificIdIndex = activeKeys.indexOf(specificId);

        this.setState({ currentlyShowing: specificId, currentlyShowingIndex: specificIdIndex });
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.activateNext(), 10000);
    }
  }

  findActiveKeys(highlights) {
    return _.sortBy(Object.entries(highlights).map((highlight) => {
      if (highlight[1].active) {
        return highlight[0];
      }
      return null;
    }).filter(item => item), item => item);
  }

  highlightButtons() {
    const { highlights } = this.props;
    const { currentlyShowingIndex } = this.state;

    const thing = this.findActiveKeys(highlights).map((hilite, index) => {

      if (currentlyShowingIndex === index) {
        return (
          <button className="button margin-leftright is-white is-small is-paddingless" key={`highlightbutton-${index}`} onClick={() => { this.activateSpecific(hilite); }}>
            <i className="fas fa-circle" />
          </button>
        );
      }
      return (
        <button className="button margin-leftright is-black is-small is-paddingless" key={`highlightbutton-${index}`} onClick={() => { this.activateSpecific(hilite); }}>
          <i className="fas fa-circle" />
        </button>
      );
    });
    return thing;
  }

  render() {
    const { highlights } = this.props;
    const { currentlyShowing } = this.state;

    if (isLoaded(highlights) && !isEmpty(highlights) && currentlyShowing) {

      const highlightId = currentlyShowing;
      const highlight = highlights[highlightId];

      return (
        <Fragment>
          <div className="highlights fadeIn card">
            <figure className="image is-3by1">
              <img alt="" src={highlight.image} />
            </figure>
          </div>
          <div className="has-text-right is-higher">
            {this.highlightButtons()}
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <div className="highlights fadeIn card">
          <figure className="image is-3by1">
            <button className="is-loading" />
          </figure>
        </div>
      </Fragment>
    );

  }
}

HighLights.propTypes = {
  highlights: PropTypes.object,
};
