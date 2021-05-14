import React from 'react';
import moment from 'moment/min/moment-with-locales';
import momentEn from 'moment';
import _ from 'lodash';
import { Settings } from '../../../models/Settings';
import { OpeningHoursException } from '../../../models/OpeningHours';
import { Category } from '../../../models/Category';
import { Day } from '../../../models/Calendar';

interface Props {
  chunkedCalendar: Day[][];
  categories: { [key: string]: Category };
  clickDay: (day: Day) => void;
  openinghoursexceptions: { [key: string]: OpeningHoursException };
  settings: Settings;
}

export const CalendarMonth = ({ chunkedCalendar, categories, clickDay, openinghoursexceptions, settings }: Props) => (
  <>
    {chunkedCalendar.map((week, weekIndex) => (
      <div key={`calendar-week-${weekIndex}`} className="column is-12 columns is-marginless">
        {week.map((day, dayIndex) => {

          if (day.empty) {
            return (
              <div key={`calendar-day-${dayIndex}`} className="column is-paddingless is-marginless is-hidden-mobile" />
            );
          }

          return (
            <CalendarDay key={`calendar-day-${dayIndex}`} day={day} openinghoursexceptions={openinghoursexceptions} settings={settings} dayIndex={dayIndex} categories={categories} clickDay={clickDay} />
          );
        })}
      </div>
    ))
    }
  </>
);

interface CalendarDay {
  day: Day;
  openinghoursexceptions: { [key: string]: OpeningHoursException };
  settings: Settings;
  dayIndex: number;
  categories: { [key: string]: Category };
  clickDay: (day: Day) => void;
}

const CalendarDay = ({ day, openinghoursexceptions, settings, dayIndex, categories, clickDay }: CalendarDay) => {
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

  const exception = _.get(openinghoursexceptions, dayMoment.format('YYYY-MM-DD'));
  const englishDayName = momentEn(dayMoment.format('DD-MM-YYYY'), 'DD-MM-YYYY').format('dddd').toLowerCase();
  const hasNoOpeningHoursNormally = _.isEmpty(_.get(settings, `openingHours.${englishDayName}`));
  const shouldCardBeHiddenOnMobile = dayClass === 'past-card' || (_.isEmpty(day.eventsForDay) && _.isEmpty(day.ongoingEventsForDay));
  const closedThisDay = (exception && exception.status === 'closed') || (hasNoOpeningHoursNormally && (!exception || exception.status === 'closed'));

  return (
    <div
      key={`calendar-day-${dayIndex}`}
      className={`column is-paddingless is-marginless ${shouldCardBeHiddenOnMobile ? 'is-hidden-mobile' : ''}`}
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
                {moment.weekdaysShort()[day.dayOfWeek!]}
              </div>
            </div>
          </div>
        </div>
        <div className="card-content is-paddingless">
          <div className="is-inline-flex">
            <div className="calendar-card-spacer calendar-image" />
            {!closedThisDay && day.ongoingEventsForDay && day.ongoingEventsForDay.map((eventEntry, index) => {
              const event = eventEntry.value;
              const eventCategory = categories[event.category];
              if (!eventCategory) {
                return (<div key={`event-img-${index}`} />);
              }
              const eventLogo = eventCategory.imageSmall ? eventCategory.imageSmall : eventCategory.image;
              return (
                <div key={`event-img-${index}`}>
                  <img className="image is-24x24 is-rounded calendar-image ongoing-event-image" src={eventLogo!} alt="" />
                </div>
              );
            })}
            {day.eventsForDay && day.eventsForDay.map((eventEntry, index) => {
              const event = eventEntry.value;
              const eventCategory = categories[event.category];
              if (!eventCategory) {
                return (<div key={`event-img-${index}`} />);
              }
              const eventLogo = eventCategory.imageSmall ? eventCategory.imageSmall : eventCategory.image;
              return (
                <img key={`event-img-${index}`} className="image is-24x24 calendar-image" src={eventLogo!} alt="" />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
