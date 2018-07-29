import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
// import firebase from 'firebase/app';
import _ from 'lodash';
import EditableField from '../../Common/EditableField';
import EditableTextarea from '../../Common/EditableTextarea';

export default class StoreInfoEditor extends Component {

  foo() {
    // firebase.update(`settings/features/${featureName}`, { active: newStatus });
  }

  render() {
    const { settings } = this.props;
    const { openingHours, location } = settings;

    if (isLoaded(settings)) {
      return (
        <Fragment>
          <h1 className="title">
            Store info
          </h1>
          <h2 className="subtitle">
            Regular Opening Hours
          </h2>
          <div className="columns is-multiline">
            <div className="column is-6">
              <EditableField
                defaultValue={_.get(openingHours, 'monday', '')}
                labelContent="monday"
                placeHolder="openinghoursfordayplaceholder"
                path="/settings/openingHours"
                targetName="monday"
              />
            </div>
            <div className="column is-6">
              <EditableField
                defaultValue={_.get(openingHours, 'tuesday', '')}
                labelContent="tuesday"
                placeHolder="openinghoursfordayplaceholder"
                path="/settings/openingHours"
                targetName="tuesday"
              />
            </div>
            <div className="column is-6">
              <EditableField
                defaultValue={_.get(openingHours, 'wednesday', '')}
                labelContent="wednesday"
                placeHolder="openinghoursfordayplaceholder"
                path="/settings/openingHours"
                targetName="wednesday"
              />
            </div>
            <div className="column is-6">
              <EditableField
                defaultValue={_.get(openingHours, 'thursday', '')}
                labelContent="thursday"
                placeHolder="openinghoursfordayplaceholder"
                path="/settings/openingHours"
                targetName="thursday"
              />
            </div>
            <div className="column is-6">
              <EditableField
                defaultValue={_.get(openingHours, 'friday', '')}
                labelContent="friday"
                placeHolder="openinghoursfordayplaceholder"
                path="/settings/openingHours"
                targetName="friday"
              />
            </div>
            <div className="column is-6">
              <EditableField
                defaultValue={_.get(openingHours, 'saturday', '')}
                labelContent="saturday"
                placeHolder="openinghoursfordayplaceholder"
                path="/settings/openingHours"
                targetName="saturday"
              />
            </div>
            <div className="column is-6">
              <EditableField
                defaultValue={_.get(openingHours, 'sunday', '')}
                labelContent="sunday"
                placeHolder="openinghoursfordayplaceholder"
                path="/settings/openingHours"
                targetName="sunday"
              />
            </div>
            <div className="column is-12">
              <EditableField
                defaultValue={_.get(openingHours, 'additionalinfo', '')}
                labelContent="additionalinfo"
                placeHolder="additionalopeninghoursinfo"
                path="/settings/openingHours"
                targetName="additionalinfo"
              />
            </div>
          </div>
          <h2 className="subtitle">
            Exceptions to opening hours
          </h2>
          <div>
            <button className="button is-primary">Show current exceptions</button>
            &nbsp;
            <button className="button is-primary">Add exception</button>
          </div>

          <h2 className="subtitle">
            Store location
          </h2>
          <div className="columns is-multiline">
            <div className="column is-12">
              <EditableTextarea
                defaultValue={_.get(location, 'directions', '')}
                labelContent="directions"
                placeHolder="directionsplaceholder"
                path="/settings/location"
                targetName="directions"
              />
            </div>
          </div>
          {/* <iframe title="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1979.1812648250936!2d24.850865115876747!3d60.26046024305865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x468df7a9432c58d3%3A0x440b6d3a3701872a!2sOh+My+Game!5e0!3m2!1sfi!2sfi!4v1532872364083" width="600" height="450" frameBorder="0" allowFullScreen /> */}
        </Fragment>
      );

    }
    return <div><Translate id="loading" /></div>;
  }
}

StoreInfoEditor.propTypes = {
  settings: PropTypes.object,
};
