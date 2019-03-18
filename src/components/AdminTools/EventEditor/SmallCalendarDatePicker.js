import React from 'react';
import moment from 'moment/min/moment-with-locales';
import momentEn from 'moment';
import _ from 'lodash';

export const SmallCalendarDatePicker = ({ chunkedCalendar, clickDay, openinghoursexceptions, settings, selectedDay, selectedEndDay }) => chunkedCalendar.map((week, weekIndex) => (
  <div key={`calendar-week-${weekIndex}`} className="column is-12 columns is-marginless is-paddingless is-mobile">
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

      const selected = selectedDay ? dayMoment.isSame(moment(selectedDay, 'YYYY-MM-DD'), 'day') : false;
      const isBetweenDates = selectedDay && selectedEndDay ? dayMoment.isBetween(moment(selectedDay, 'YYYY-MM-DD'), moment(selectedEndDay, 'YYYY-MM-DD'), 'day', '()') : false;
      const selectedEnd = selectedEndDay ? dayMoment.isSame(moment(selectedEndDay, 'YYYY-MM-DD'), 'day') : false;

      if (day.empty) {
        return (
          <div key={`calendar-day-${dayIndex}`} className="column is-paddingless is-marginless" />
        );
      }

      const exception = _.get(openinghoursexceptions, dayMoment.format('YYYY-MM-DD'));

      const englishDayName = momentEn(dayMoment.format('DD-MM-YYYY'), 'DD-MM-YYYY').format('dddd').toLowerCase();
      const hasNoOpeningHoursNormally = _.isEmpty(_.get(settings, `openingHours.${englishDayName}`));
      const closedThisDay = (exception && !exception.open) || (hasNoOpeningHoursNormally && (!exception || !exception.open));

      return (
        <div key={`calendar-day-${dayIndex}`} className="column is-paddingless is-marginless">
          <div className={`card calendar-day ${dayClass} ${closedThisDay && 'strikeover'} ${(selected || selectedEnd) && 'has-background-info'} ${isBetweenDates && 'has-background-success'}`} onClick={() => { clickDay(day.dayLink); }}>
            <div className="card-header">
              <div className="card-header-title calendar-title">
                <div className="level calendar-cardtitle">
                  <div className={`level-left ${selected && 'has-text-black'}`}>
                    {day.day}
                  </div>
                  <div className={`level-right is-marginless has-text-right ${selected ? 'has-text-black' : 'has-text-info'}`}>
                    {moment.weekdaysShort()[day.dayOfWeek]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
));
