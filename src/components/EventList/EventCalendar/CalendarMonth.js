import React from 'react';
import moment from 'moment/min/moment-with-locales';
import momentEn from 'moment';
import _ from 'lodash';

export const CalendarMonth = ({ chunkedCalendar, categories, clickDay, openinghoursexceptions, settings }) => chunkedCalendar.map((week, weekIndex) => (
  <div key={`calendar-week-${weekIndex}`} className="column is-12 columns is-marginless">
    {week.map((day, dayIndex) => {

      let dayClass = '';
      const today = moment();
      const dayMoment = moment(day.dayLink, 'YYYY/MM/DD');
      if (dayMoment.isSame(today, 'day')) {
        dayClass = 'today-card';
      } else if (dayMoment.isBefore(today, 'day')) {
        dayClass = 'past-card';
      } else if (dayMoment.isAfter(today, 'day')) {
        dayClass = 'future-card';
      }

      if (day.empty) {
        return (
          <div key={`calendar-day-${dayIndex}`} className="column is-paddingless is-marginless is-hidden-mobile" />
        );
      }

      const exception = _.get(openinghoursexceptions, dayMoment.format('YYYY-MM-DD'));

      const englishDayName = momentEn(dayMoment.format('DD-MM-YYYY'), 'DD-MM-YYYY').format('dddd').toLowerCase();
      const hasNoOpeningHoursNormally = _.isEmpty(_.get(settings, `openingHours.${englishDayName}`));
      const closedThisDay = (exception && !exception.open) || (hasNoOpeningHoursNormally && (!exception || !exception.open));

      return (
        <div
          key={`calendar-day-${dayIndex}`}
          className={`column is-paddingless is-marginless ${_.isEmpty(day.eventsForDay) && 'is-hidden-mobile'}`}
        >

          <div className={`card calendar-day ${dayClass} ${closedThisDay && 'strikeover'}`} onClick={() => { clickDay(day); }}>
            <div className="card-header">
              <div className="card-header-title calendar-title">
                <div className="level calendar-cardtitle">
                  <div className="level-left">
                    <span className="is-hidden-mobile">
                      {day.day}
                    </span>
                    <span className="is-hidden-tablet">
                      {moment(day.dayLink, 'YYYY/MM/DD').format('dddd DD.MM.YYYY')}
                    </span>
                  </div>
                  <div className="level-right has-text-right has-text-info is-hidden-mobile">
                    {moment.weekdaysShort()[day.dayOfWeek]}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-content is-paddingless">
              <div className="is-inline-flex">
                <div className="calendar-card-spacer calendar-image" />
                {!closedThisDay && day.ongoingEventsForDay.map((eventEntry, index) => {
                  const event = eventEntry.value;
                  const eventLogo = categories[event.category].image;
                  return (
                    <img key={`event-img-${index}`} className="image is-24x24 is-rounded calendar-image ongoing-event-image" src={eventLogo} alt="" />
                  );
                })}
                {day.eventsForDay.map((eventEntry, index) => {
                  const event = eventEntry.value;
                  const eventLogo = categories[event.category].image;
                  return (
                    <img key={`event-img-${index}`} className="image is-24x24 calendar-image" src={eventLogo} alt="" />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
));
