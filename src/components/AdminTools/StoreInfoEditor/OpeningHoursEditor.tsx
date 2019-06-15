import React, { Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import EditableField from '../../Common/EditableField';
import { OpeningHours } from '~/models/Settings';

interface Props {
  openingHours?: OpeningHours;
  toggleOpeningHourExceptions: () => void;
}

export const OpeningHoursEditor = ({ openingHours, toggleOpeningHourExceptions }: Props) => (
  <Fragment>
    <h2 className="subtitle">
      <Translate id="regularopeninghours" />
    </h2>
    <div className="box columns is-multiline">
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
      <div className="column is-12 is-paddingless is-marginless">
        <hr />
      </div>
      <div className="column is-6">
        <EditableField
          defaultValue={_.get(openingHours, 'additionalinfo', '')}
          labelContent="additionalinfo"
          placeHolder="additionalopeninghoursinfo"
          path="/settings/openingHours"
          targetName="additionalinfo"
        />
      </div>
      <div className="column is-6">
        <div className="field is-grouped is-pulled-right">
          <p className="control">
            <button className="button is-primary" onClick={() => toggleOpeningHourExceptions()}><Translate id="showcurrentexceptions" /></button>
          </p>
        </div>
      </div>
    </div>
  </Fragment>
);
