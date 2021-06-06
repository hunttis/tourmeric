import React from "react";
import { FormattedMessage, IntlShape } from "react-intl";
import { isLoaded } from "react-redux-firebase";
import moment from "moment";
import _ from "lodash";
import { OpeningHoursException } from "../../models/OpeningHours";
import { Settings } from "../../models/Settings";

interface Props {
  day?: string | null;
  settings: Settings;
  openinghoursexceptions: { [key: string]: OpeningHoursException };
}

export const OpeningHours = ({
  day,
  settings,
  openinghoursexceptions,
}: Props) => {
  if (isLoaded(settings) && isLoaded(openinghoursexceptions)) {
    const dayMoment = day ? moment(day, "YYYY-MM-DD") : moment();
    const isToday = moment().isSame(dayMoment, "day");
    const todayName = dayMoment.format("dddd").toLowerCase();
    const dateString = dayMoment.format("YYYY-MM-DD");
    const daysHours = _.get(settings, `openingHours.${todayName}`, "");
    const exception = _.get(openinghoursexceptions, dateString);

    if (exception) {
      if (exception.status === "closed") {
        return (
          <>
            <span className="has-text-danger">
              {isToday && <FormattedMessage id="exceptionallynotopentoday" />}
              {!isToday && <FormattedMessage id="exceptionallynotopen" />}
            </span>
            : {exception.name}
          </>
        );
      }
      return (
        <>
          <span className="has-text-success">
            {isToday && <FormattedMessage id="exceptionallyopentoday" />}
            {!isToday && <FormattedMessage id="exceptionallyopen" />}
          </span>
          : {exception.openingHours}
          <p>{exception.name}</p>
        </>
      );
    }
    if (_.isEmpty(daysHours)) {
      return (
        <>
          {isToday && (
            <>
              <FormattedMessage id="closedtoday" />
            </>
          )}
          {!isToday && (
            <>
              <FormattedMessage id="closed" />
            </>
          )}
        </>
      );
    }
    return (
      <>
        {isToday && (
          <>
            <FormattedMessage id="opentoday" /> :{" "}
            <span className="has-text-success">{daysHours}</span>
          </>
        )}
        {!isToday && (
          <>
            <FormattedMessage id="open" /> :{" "}
            <span className="has-text-success">{daysHours}</span>
          </>
        )}
      </>
    );
  }
  return <div />;
};
