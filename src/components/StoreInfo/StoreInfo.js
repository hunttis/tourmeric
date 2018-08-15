import React, { Component, Fragment } from 'react';
import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import { OpeningHourRow } from './OpeningHourRow';

export default class StoreInfo extends Component {

  foo() {

  }

  render() {
    const { settings } = this.props;
    if (isLoaded(settings)) {
      const { openingHours, location } = settings;
      return (
        <Fragment>
          <div className="section">

            <h1 className="title">
              <Translate id="contactinfo" />
            </h1>

            <div className="columns is-multiline">


              <div className="column is-6">
                {location.phone &&
                  <div className="box">
                    <Fragment>
                      <h2 className="subtitle">
                        <span className="icon"><i className="fas fa-phone" /></span>&nbsp;&nbsp;<Translate id="phone" />
                      </h2>
                      <div><a href={`tel:${location.phone}`}>{location.phone}</a></div>
                    </Fragment>
                  </div>
                }
                {location.email &&
                  <Fragment>
                    <div className="box">

                      <h2 className="subtitle">
                        <span className="icon"><i className="fas fa-envelope" /></span>&nbsp;&nbsp;<Translate id="email" />
                      </h2>
                      <div><a href={`mailto:${location.email}`}>{location.email}</a></div>
                    </div>
                  </Fragment>
                }
              </div>
              <div className="column is-6">
                <div className="box">
                  {location.address &&
                  <Fragment>
                    <h2 className="subtitle">
                      <span className="icon"><i className="fas fa-address-book" /></span>&nbsp;&nbsp;<Translate id="address" />
                    </h2>
                    {location.address.split('\n').map((line, index) => <div key={index}>{line}&nbsp;</div>)}
                  </Fragment>
                      }
                </div>
              </div>

              <div className="column is-6">
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
              </div>

              {settings.location && settings.location.directions &&
                <div className="column is-6">
                  <div className="box">
                    <h2 className="subtitle">
                      <Translate id="directions" />
                    </h2>

                    {settings.activeLocationImage &&
                      <div>
                        <a href={settings.activeLocationImage}>
                          <img alt="" className="image" src={settings.activeLocationImage} />
                        </a>
                      </div>
                    }
                    <div>
                      {settings.location.directions}
                    </div>
                  </div>
                </div>
              }
            </div>

          </div>
        </Fragment>
      );
    }
    return <div><Translate id="loading" /></div>;
  }

}

StoreInfo.propTypes = {
  settings: PropTypes.object,
};
