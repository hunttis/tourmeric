import React from 'react';
import moment from 'moment/min/moment-with-locales';
import _ from 'lodash';

export const CalendarMonth = ({ chunkedCalendar, categories, clickDay }) => chunkedCalendar.map((week, weekIndex) => (
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
      return (
        <div
          key={`calendar-day-${dayIndex}`}
          className={`column is-paddingless is-marginless ${_.isEmpty(day.eventsForDay) && 'is-hidden-mobile'}`}
        >
          <div className={`card calendar-day ${dayClass}`} onClick={() => { clickDay(day); }}>
            <div className="card-header">
              <div className="card-header-title calendar-title">
                <div className="level calendar-cardtitle">
                  <div className="level-left">
                    {day.day}
                  </div>
                  <div className="level-right has-text-right has-text-info">
                    {moment.weekdaysShort()[day.dayOfWeek]}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-content is-paddingless">
              <div className="is-inline-flex">
                <div className="calendar-card-spacer calendar-image" />
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
