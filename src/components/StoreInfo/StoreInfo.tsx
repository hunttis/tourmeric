import React from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { FormattedMessage } from "react-intl";
import { OpeningHourRow } from './OpeningHourRow';
import { Settings } from '../../models/Settings';

interface Props {
  settings: Settings;
}

export const StoreInfo = ({ settings }: Props) => {

  if (isLoaded(settings) && !isEmpty(settings.location) && settings.location) {
    const { openingHours, location } = settings;
    return (
      <>
        <div className="section">

          <h1 className="title">
            <FormattedMessage id="contactinfo" />
          </h1>

          <div className="columns is-multiline">

            <div className="column is-6">
              {location.phone &&
                <div className="box">
                  <>
                    <h2 className="subtitle">
                      <span className="icon"><i className="fas fa-phone" /></span>&nbsp;&nbsp;<FormattedMessage id="phone" />
                    </h2>
                    <div><a href={`tel:${location.phone}`}>{location.phone}</a></div>
                  </>
                </div>
              }
              {location.email &&
                <>
                  <div className="box">

                    <h2 className="subtitle">
                      <span className="icon"><i className="fas fa-envelope" /></span>&nbsp;&nbsp;<FormattedMessage id="email" />
                    </h2>
                    <div><a href={`mailto:${location.email}`}>{location.email}</a></div>
                  </div>
                </>
              }
            </div>
            <div className="column is-6">
              <div className="box">
                {location.address &&
                  <>
                    <h2 className="subtitle">
                      <span className="icon"><i className="fas fa-address-book" /></span>&nbsp;&nbsp;<FormattedMessage id="address" />
                    </h2>
                    {location.address.split('\n').map((line, index) => <div key={index}>{line}&nbsp;</div>)}
                  </>
                }
              </div>
            </div>

            <div className="column is-6">
              <div className="box">
                <h2 className="subtitle">
                  <FormattedMessage id="regularopeninghours" />
                </h2>
                <table className="table">
                  <tbody>
                    <OpeningHourRow dayName="monday" settings={settings} />
                    <OpeningHourRow dayName="tuesday" settings={settings} />
                    <OpeningHourRow dayName="wednesday" settings={settings} />
                    <OpeningHourRow dayName="thursday" settings={settings} />
                    <OpeningHourRow dayName="friday" settings={settings} />
                    <OpeningHourRow dayName="saturday" settings={settings} />
                    <OpeningHourRow dayName="sunday" settings={settings} />
                  </tbody>
                </table>

                {openingHours && openingHours.additionalinfo &&
                  <div>
                    {openingHours.additionalinfo}
                  </div>
                }

                {/* TODO: Show upcoming opening hours exceptions (maybe, if it's useful here) */}
                <div />
              </div>
            </div>

            {settings.location && settings.location.directions &&
              <div className="column is-6">
                <div className="box">
                  <h2 className="subtitle">
                    <FormattedMessage id="directions" />
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
      </>
    );
  }
  if (isLoaded(settings) && isEmpty(settings.location)) {
    return <div><FormattedMessage id="nostoreinfo" /></div>;
  }
  return <div><FormattedMessage id="loading" /></div>;

};
