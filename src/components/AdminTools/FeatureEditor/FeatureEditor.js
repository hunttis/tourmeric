import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import _ from 'lodash';

export default class FeatureEditor extends Component {

  setFeatureStatus(featureName, newStatus) {
    firebase.update(`settings/features/${featureName}`, { active: newStatus });
  }

  render() {
    const { settings } = this.props;
    const features = _.get(settings, 'features', {});

    const featureList = ['highlights', 'events'];

    if (isLoaded(settings)) {
      return (
        <Fragment>
          <div className="tile is-ancestor">

            {featureList.map((feature) => {
              const featureActive = _.get(features, `${feature}.active`, false);
              return (
                <div key={feature} className="tile is-parent is-4">
                  <div className="tile is-child box">
                    <div className="level">
                      <div className="level-item">
                        {feature}
                      </div>
                      <div className="level-item">
                        {featureActive && <button className="button is-danger" onClick={() => this.setFeatureStatus(feature, false)}>Deactivate</button>}
                        {!featureActive && <button className="button is-success" onClick={() => this.setFeatureStatus(feature, true)}>Activate</button>}
                      </div>
                    </div>
                  </div>
                </div>
                );
              })
            }
          </div>
        </Fragment>
      );

    }
    return <div><Translate id="loading" /></div>;
  }
}

FeatureEditor.propTypes = {
  settings: PropTypes.object,
};
