import React, { Component, Fragment } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import EventCard from '../EventCard/EventCard-container';
import { CalendarMonth } from './CalendarMonth';
import OpeningHours from '../../StoreInfo/OpeningHours-container';

const YEAR_INDEX = 2;
const MONTH_INDEX = 3;
const DAY_INDEX = 4;

const MODE_MONTH = 'month';
const MODE_DAY = 'day';

export default class EventCalendar extends Component {

  constructor(props) {
    super(props);

    const favoriteCategories = _.get(props, 'profile.favoriteCategories', '');
    const defaultFilter = favoriteCategories.split(' ');

    const targetData = this.parseTargetMonthYearAndMode(props.location);

    this.state = { categoryFilter: _.compact(defaultFilter),
      ...targetData };

    this.scrollElement = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.location, nextProps.location)) {
      const targetData = this.parseTargetMonthYearAndMode(nextProps.location);
      this.setState({ ...targetData });
    }
  }

  componentWillUnmount() {
    if (!this.scrollElement) {
      this.scrollElement.removeEventListener('scroll', this.checkStateShouldShowArrow);
    }
    document.documentElement.classList.remove('is-clipped');
  }

  updateScrollRef = (element) => {
    if (element) {
      this.scrollElement = element;
      this.checkStateShouldShowArrow();
      element.addEventListener('scroll', this.checkStateShouldShowArrow);
    }
  }

  checkStateShouldShowArrow = () => {
    const element = this.scrollElement;
    this.setState({ showArrow: element.scrollTop <= element.scrollHeight - window.innerHeight - 10 });
  }

  parseTargetMonthYearAndMode(location) {
    let targetYear = moment().format('YYYY');
    let targetMonth = moment().format('MM');
    let targetDay = moment().format('DD');
    let mode = MODE_MONTH;

    const splitPath = location.pathname.split('/');
    const pathLength = splitPath.length;

    document.documentElement.classList.remove('is-clipped');

    if (pathLength === 2) {
      mode = MODE_MONTH;
    } else if (pathLength < 5) {
      targetYear = _.get(splitPath, YEAR_INDEX, targetYear);
      targetMonth = _.get(splitPath, MONTH_INDEX, targetMonth);
      mode = MODE_MONTH;
    } else if (pathLength === 5) {
      console.log('day mode!');
      targetYear = _.get(splitPath, YEAR_INDEX, targetYear);
      targetMonth = _.get(splitPath, MONTH_INDEX, targetMonth);
      targetDay = _.get(splitPath, DAY_INDEX, targetDay);
      mode = MODE_DAY;
      document.documentElement.classList.add('is-clipped');
    }

    return { targetYear, targetMonth, targetDay, mode };
  }

  toggleFilter(categoryId) {
    const { categoryFilter } = this.state;
    if (_.includes(categoryFilter, categoryId)) {
      const newFilter = categoryFilter.slice();
      newFilter.splice(newFilter.indexOf(categoryId), 1);
      this.setState({ categoryFilter: newFilter });
    } else {
      const newFilter = categoryFilter.slice();
      newFilter.push(categoryId);
      this.setState({ categoryFilter: newFilter });
    }
  }

  runEventFilters(events) {
    const { categoryFilter } = this.state;

    const publishedEvents = events.filter(event => event.value.published);
    if (_.isEmpty(categoryFilter)) {
      return publishedEvents;
    }

    const publishedAndFilteredEvents = publishedEvents.filter(event => _.includes(this.state.categoryFilter, event.value.category));
    return publishedAndFilteredEvents;
  }

  modalItem(translationKey, content) {
    if (content) {
      return (
        <div className="column is-12">
          <div className="title"><Translate id={translationKey} /></div>
          <p>
            {content}
          </p>
        </div>
      );
    }
    return <div />;
  }

  forwardMonth() {
    const newMonth = moment(`${this.state.targetMonth}-${this.state.targetYear}`, 'MM-YYYY').add(1, 'month');
    this.props.history.push(`/events/${newMonth.format('YYYY/MM')}`);
  }

  backMonth() {
    const newMonth = moment(`${this.state.targetMonth}-${this.state.targetYear}`, 'MM-YYYY').subtract(1, 'month');
    this.props.history.push(`/events/${newMonth.format('YYYY/MM')}`);
  }

  clickDay(day) {
    this.props.history.push(`/events/${day.dayLink}`);
  }

  backToCalendar() {
    this.props.history.push(`/events/${this.state.targetYear}/${this.state.targetMonth}`);
  }

  parseInformationForMonthYear(month, year) {

    const { events, eventsongoing } = this.props;

    const targetMonth = moment(`${month}-${year}`, 'MM-YYYY');
    const dayCount = targetMonth.daysInMonth();
    const days = [];
    const publishedEvents = this.runEventFilters(events);

    const publishedOngoingEvents = eventsongoing ? this.runEventFilters(eventsongoing) : [];

    for (let i = 1; i <= dayCount; i += 1) {
      const dayString = `${_.padStart(i, 2, '0')}-${targetMonth.format('MM-YYYY')}`;
      const day = moment(dayString, 'DD-MM-YYYY');
      const dayStringInEventFormat = moment(dayString, 'DD-MM-YYYY').format('YYYY-MM-DD');
      const eventsForDay = publishedEvents.filter(eventEntry => eventEntry.value.date === dayStringInEventFormat);
      const eventsOnGoing = publishedOngoingEvents.filter((eventEntry) => {
        if (eventEntry.value.endDate) {
          return day.isBetween(moment(eventEntry.value.date, 'YYYY-MM-DD'), moment(eventEntry.value.endDate, 'YYYY-MM-DD'), 'day', '[]');
        }
        return false;
      });

      days.push({ day: day.format('DD'),
        dayOfWeek: day.format('d'),
        dayName: day.format('dddd'),
        dayString: day.format('DD-MMMM-YYYY'),
        dayLink: day.format('YYYY/MM/DD'),
        eventsForDay,
        ongoingEventsForDay: eventsOnGoing });
    }

    const emptyDays = (days[0].dayOfWeek % 7) - 1;
    const calendar = [];
    for (let i = 0; i < emptyDays; i += 1) {
      calendar.push({ empty: true });
    }
    _.forEach(days, day => calendar.push(day));
    return calendar;
  }

  chunkedCalendar(calendar) {
    const chunkedCalendar = _.chunk(calendar, 7);
    while (chunkedCalendar[chunkedCalendar.length - 1].length < 7) {
      chunkedCalendar[chunkedCalendar.length - 1].push({ empty: true });
    }
    return chunkedCalendar;
  }

  async goToEventEditor(momentForDay) {
    const { history, setReturnLocation } = this.props;
    await setReturnLocation(history.location.pathname);
    history.push(`/admin/events/newevent/${momentForDay.format('YYYY-MM-DD')}`);
  }


  render() {
    const {
      events, categories, activeLanguage, location, openinghoursexceptions, settings, isAdmin,
    } = this.props;

    const { targetMonth, targetYear, mode } = this.state;

    if (!isLoaded(events) || !isLoaded(categories)) {
      return <div className="is-loading"><Translate id="loading" /></div>;
    } if (isLoaded(events) && isEmpty(events)) {
      return <div><Translate id="noevents" /></div>;
    }

    moment.locale(activeLanguage);

    const calendar = this.parseInformationForMonthYear(targetMonth, targetYear);
    const chunkedCalendar = this.chunkedCalendar(calendar);

    const categoryNames = this.state.categoryFilter.map(category => categories[category].name).join(', ');

    const dayInPath = location.pathname.substring('/events/'.length);

    const eventsForDay = mode === MODE_DAY ? _.get(_.find(calendar, { dayLink: dayInPath }), 'eventsForDay', []) : [];
    const ongoingEventsForDay = mode === MODE_DAY ? _.get(_.find(calendar, { dayLink: dayInPath }), 'ongoingEventsForDay', []) : [];

    const momentForDay = mode === MODE_DAY && moment(dayInPath, 'YYYY/MM/DD');

    const parsedEvents = eventsForDay.map((event) => {
      const sortId = moment(`${event.value.date}-${event.value.time}`, 'YYYY-MM-DD-HH:mm').format('YYYYMMDDHHmm');
      return { id: sortId, ...event };
    });

    const sortedEvents = _.sortBy(parsedEvents, event => event.id);

    return (
      <section className="section">
        {mode === MODE_DAY &&
          <div className="modal is-active">
            <div className="modal-background" onClick={() => this.backToCalendar()} />
            <div className="modal-content box" ref={this.updateScrollRef}>
              {this.state.showArrow &&
                <div className="more-to-scroll"><i className="fas fa-angle-double-down" /></div>
              }

              <div className="columns is-multiline">
                <div className="column is-6">
                  <h2 className="subtitle is-capitalized">{momentForDay.format('dddd, MMMM YYYY')}</h2>
                </div>
                <div className="column is-6 has-text-right">
                  {isAdmin &&
                  <button className="button has-icons-left" onClick={() => { this.goToEventEditor(momentForDay); }}><i className="fas fa-calendar" />&nbsp;<Translate id="addevent" /></button>
                  }
                </div>
                <div className="column is-6">
                  <OpeningHours day={momentForDay.format('YYYY-MM-DD')} />
                </div>
                <div className="column is-6 has-text-right">
                  {/* {isAdmin &&
                  <button className="button has-icons-left" onClick={() => {}}><i className="fas fa-toolbox" />&nbsp;<Translate id="addexception" /></button>
                  } */}
                </div>
              </div>
              <p>&nbsp;</p>
              {(_.isEmpty(eventsForDay) && _.isEmpty(ongoingEventsForDay)) && <p><Translate id="noeventsforthisday" /></p>}
              {!_.isEmpty(eventsForDay) &&
              <Fragment>
                <h2 className="subtitle"><Translate id="eventsfortoday" /></h2>
                <div>
                  {sortedEvents.map((eventEntry, index) => {
                    const eventId = eventEntry.key;
                    return <EventCard key={`events-for-day-${index}`} eventId={eventId} />;
                  })}
                </div>
              </Fragment>
              }
              {!_.isEmpty(ongoingEventsForDay) &&
              <Fragment>
                <h2 className="subtitle"><Translate id="ongoingevents" /></h2>
                <div>
                  {ongoingEventsForDay.map((eventEntry, index) => {
                    const eventId = eventEntry.key;
                    return <EventCard key={`events-for-day-${index}`} eventId={eventId} />;
                  })}
                </div>
              </Fragment>
              }


            </div>
            <button className="modal-close is-large" aria-label="close" onClick={() => this.backToCalendar()} />
          </div>
        }
        <div className="container">

          <h1 className="title"><Translate id="nextevents" /></h1>

          <div className="columns is-multiline">

            <div className="column is-12">
              <Translate id="filtereventsbychoosingcategories" />
              <Translate>
                { translate => (
                  <div>
                    {translate('currentlyshowing')}
                    {_.isEmpty(this.state.categoryFilter) ? translate('all') : translate('only')} <span className="has-text-success">{categoryNames}</span> {translate('events')}
                  </div>
                )}
              </Translate>

            </div>

            <div className="column is-12 is-mobile has-text-centered">
              {isLoaded(categories) && Object.entries(categories).map((categoryEntry) => {
                const activeStatus = _.includes(this.state.categoryFilter, categoryEntry[0]) ? 'is-primary' : '';
                const buttonClass = `button is-grouped ${activeStatus}`;

                const category = categories[categoryEntry[0]];

                return (
                  <div key={`categoryfilter-${categoryEntry[0]}`} className="is-one-quarter-desktop is-one-quarter-tablet is-one-third-mobile has-text-centered is-inline-flex">
                    <button className={`${buttonClass} is-hidden-mobile image-square`} onClick={() => this.toggleFilter(categoryEntry[0])}>
                      <img className="image is-48x48" src={category.image} alt="" />
                    </button>
                    <button className={`${buttonClass} is-hidden-tablet`} onClick={() => this.toggleFilter(categoryEntry[0])}>
                      <img className="image is-24x24" src={category.image} alt="" />
                    </button>
                  </div>
                );
              })
              }
            </div>

            <div className="column is-6">
              <h1 className="title">{_.capitalize(moment(`${targetMonth}-${targetYear}`, 'MM-YYYY').format('MMMM'))}</h1>
            </div>
            <div className="column is-6">
              <div className="buttons has-addons is-right">
                <button className="button" onClick={() => { this.backMonth(); }}><Translate id="previousmonth" /></button>
                <button className="button" onClick={() => { this.forwardMonth(); }}><Translate id="nextmonth" /></button>
              </div>
            </div>

            <CalendarMonth
              chunkedCalendar={chunkedCalendar}
              categories={categories}
              clickDay={day => this.clickDay(day)}
              openinghoursexceptions={openinghoursexceptions}
              settings={settings}
            />
          </div>
        </div>
      </section>
    );
  }
}

EventCalendar.propTypes = {
  settings: PropTypes.object,
  events: PropTypes.array,
  eventsongoing: PropTypes.array,
  categories: PropTypes.object,
  activeLanguage: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  openinghoursexceptions: PropTypes.object,
  isAdmin: PropTypes.bool,
  setReturnLocation: PropTypes.func.isRequired,
};
