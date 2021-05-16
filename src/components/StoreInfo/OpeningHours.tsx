import React from "react";
import { Translate } from "react-localize-redux";
import { isLoaded } from "react-redux-firebase";
import { FormattedMessage } from "react-intl";
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
              {isToday && <Translate id="exceptionallynotopentoday" />}
              {!isToday && <Translate id="exceptionallynotopen" />}
            </span>
            : {exception.name}
          </>
        );
      }
      return (
        <>
          <span className="has-text-success">
            {isToday && <Translate id="exceptionallyopentoday" />}
            {!isToday && <Translate id="exceptionallyopen" />}
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
              <Translate id="closedtoday" />
            </>
          )}
          {!isToday && (
            <>
              <Translate id="closed" />
            </>
          )}
        </>
      );
    }
    return (
      <>
        {isToday && (
          <>
            <Translate id="opentoday" /> :{" "}
            <span className="has-text-success">{daysHours}</span>
          </>
        )}
        {!isToday && (
          <>
            <Translate id="open" /> :{" "}
            <span className="has-text-success">{daysHours}</span>
          </>
        )}
      </>
    );
  }
  return <div />;
};
