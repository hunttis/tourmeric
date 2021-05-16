import React, { Component } from 'react';
import { FormattedMessage } from "react-intl";
import { isLoaded } from 'react-redux-firebase';
import firebase from 'firebase/app';
import _ from 'lodash';
import { Settings } from '../../../models/Settings';

interface Props {
  settings: Settings;
}

export default class FeatureEditor extends Component<Props> {

  setFeatureStatus(featureName: string, newStatus: boolean) {
    firebase.update(`settings/features/${featureName}`, { active: newStatus });
  }

  render() {
    const { settings } = this.props;
    const features = _.get(settings, 'features', {});

    const featureList = ['highlights', 'events', 'storeinfo', 'language-fi', 'language-en'];

    if (isLoaded(settings)) {
      return (
        <>
          <div className="columns is-multiline">

            {featureList.map((feature) => {
              const featureActive = _.get(features, `${feature}.active`, false);
              return (
                <div key={feature} className="column is-4">
                  <div className="box">
                    <div className="level">
                      <div className="level-left">
                        <span className={`has-text-${featureActive ? 'success' : 'danger'}`}><i className="fas fa-circle" /></span>&nbsp;
                        {feature}
                      </div>
                      <div className="level-right">
                        {featureActive && <button className="button is-danger is-outlined" onClick={() => this.setFeatureStatus(feature, false)}><FormattedMessage id="deactivate" /></button>}
                        {!featureActive && <button className="button is-success is-outlined" onClick={() => this.setFeatureStatus(feature, true)}><FormattedMessage id="activate" /></button>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
            }
          </div>
        </>
      );

    }
    return <div><FormattedMessage id="loading" /></div>;
  }
}
