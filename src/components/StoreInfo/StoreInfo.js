import React, { Component, Fragment } from 'react';
import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

export default class StoreInfo extends Component {

  foo() {

  }

  render() {
    const { settings } = this.props;
    if (isLoaded(settings)) {
      const { openingHours } = settings;
      return (
        <Fragment>
          <div className="section">

            <h1 className="title">
              <Translate id="storeinfo" />
            </h1>
            <div className="box">
              <h2 className="subtitle">
                <Translate id="regularopeninghours" />
              </h2>
              <table className="table">
                <tbody>
                  <OpeningHourRow dayName="Monday" settings={settings} />
                  <OpeningHourRow dayName="Tuesday" settings={settings} />
                  <OpeningHourRow dayName="Wednesday" settings={settings} />
                  <OpeningHourRow dayName="Thursday" settings={settings} />
                  <OpeningHourRow dayName="Friday" settings={settings} />
                  <OpeningHourRow dayName="Saturday" settings={settings} />
                  <OpeningHourRow dayName="Sunday" settings={settings} />
                </tbody>
              </table>

              {openingHours && openingHours.additionalinfo &&
              <div>
                {openingHours.additionalinfo}
              </div>
              }

              <div />

              {openingHours && openingHours.exceptions &&
                <h2 className="subtitle">
                  <Translate id="upcomingexceptionstoopeninghours" />
                </h2>
              }
            </div>

            {settings.location && settings.location.directions &&
              <Fragment>
                <div className="box">
                  <h2 className="subtitle">
                    <Translate id="directions" />
                  </h2>
                  <div>
                    {settings.location.directions}
                  </div>
                </div>
              </Fragment>
            }
          </div>
        </Fragment>
      );
    }
    return <div><Translate id="loading" /></div>;
  }

}

const OpeningHourRow = ({ settings, dayName }) => {
  const { openingHours } = settings;
  const storeIsOpen = !_.isEmpty(openingHours[dayName.toLowerCase()]);

  if (!storeIsOpen) {
    return (
      <tr>
        <td>{dayName}</td>
        <td><Translate id="closed" /></td>
      </tr>
    );
  }
  if (storeIsOpen) {
    return (
      <tr>
        <td>{dayName}</td>
        <td>{openingHours[dayName.toLowerCase()]}</td>
      </tr>
    );
  }
  return (
    <tr>
      <td>ERROR</td>
    </tr>
  );
};

OpeningHourRow.propTypes = {
  settings: PropTypes.object,
  dayName: PropTypes.string,
};

StoreInfo.propTypes = {
  settings: PropTypes.object,
};
