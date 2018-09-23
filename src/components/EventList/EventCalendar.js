import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import EventCard from './EventCard-container';

export default class EventCalendar extends Component {

  constructor(props) {
    super(props);

    const favoriteCategories = _.get(props, 'profile.favoriteCategories', '');
    const defaultFilter = favoriteCategories.split(' ');
    this.state = { categoryFilter: _.compact(defaultFilter), viewedDate: moment(), dayModalOpen: false, day: null };
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
    this.setState(prevState => ({ viewedDate: prevState.viewedDate.add(1, 'month') }));
  }

  backMonth() {
    this.setState(prevState => ({ viewedDate: prevState.viewedDate.subtract(1, 'month') }));
  }

  openModalForDay(day) {
    this.setState({ dayModalOpen: true, day });
  }

  render() {
    const {
      events, participations, profile, categories, settings, uploadedCategoryLogos, activeLanguage,
    } = this.props;

    const { viewedDate } = this.state;

    if (!isLoaded(participations) || !isLoaded(profile) || !isLoaded(events) || !isLoaded(settings) || !isLoaded(uploadedCategoryLogos) || !isLoaded(categories)) {
      return <div><Translate id="loading" /></div>;
    } if (isLoaded(events) && isEmpty(events)) {
      return <div><Translate id="noevents" /></div>;
    }
    const publishedEvents = this.runEventFilters(events);

    const categoryNames = this.state.categoryFilter.map(category => categories[category].name).join(', ');

    const dayCount = viewedDate.daysInMonth();
    const days = [];

    moment.locale(activeLanguage);

    for (let i = 1; i <= dayCount; i += 1) {
      const dayString = `${_.padStart(i, 2, '0')}-${viewedDate.format('MM-YYYY')}`;
      const day = moment(dayString, 'DD-MM-YYYY');
      const dayStringInEventFormat = moment(dayString, 'DD-MM-YYYY').format('YYYY-MM-DD');
      const eventsForDay = publishedEvents.filter(eventEntry => eventEntry.value.date === dayStringInEventFormat);
      days.push({ day: day.format('DD'), dayOfWeek: day.format('d'), dayName: day.format('dddd'), dayString: day.format('DD-MMMM-YYYY'), eventsForDay });
    }

    const emptyDays = (days[0].dayOfWeek % 7) - 1;
    const calendar = [];
    for (let i = 0; i < emptyDays; i += 1) {
      calendar.push({ empty: true });
    }
    _.forEach(days, day => calendar.push(day));
    const chunkedCalendar = _.chunk(calendar, 7);
    while (chunkedCalendar[chunkedCalendar.length - 1].length < 7) {
      chunkedCalendar[chunkedCalendar.length - 1].push({ empty: true });
    }

    return (
      <section className="section">
        {this.state.dayModalOpen &&
          <div className="modal is-active">
            <div className="modal-background" onClick={() => this.setState({ dayModalOpen: false, day: null })} />
            <div className="modal-content box">
              {_.isEmpty(this.state.day.eventsForDay) && <Translate id="noeventsforthisday" />}
              {!_.isEmpty(this.state.day.eventsForDay) &&
              <div>
                {this.state.day.eventsForDay.map((eventEntry, index) => {
                  const eventId = eventEntry.key;
                  return <EventCard key={`events-for-day-${index}`} eventId={eventId} />;
                })}
              </div>
            }

            </div>
            <button className="modal-close is-large" aria-label="close" onClick={() => this.setState({ dayModalOpen: false, day: null })} />
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
                const buttonClass = `button is-grouped image-square ${activeStatus} `;

                const category = categories[categoryEntry[0]];

                return (
                  <div key={`categoryfilter-${categoryEntry[0]}`} className="is-one-quarter-desktop is-one-quarter-tablet is-one-third-mobile has-text-centered is-inline-flex">
                    <button
                      className={buttonClass}
                      onClick={() => this.toggleFilter(categoryEntry[0])}
                    >
                      <img className="image is-48x48" src={category.image} alt="" />
                    </button>
                  </div>
                );
              })
              }
            </div>

            <div className="column is-6">
              <h1 className="title">{_.capitalize(viewedDate.format('MMMM'))}</h1>
            </div>
            <div className="column is-6">
              <div className="buttons has-addons is-pulled-right">
                <button className="button" onClick={() => { this.backMonth(); }}><Translate id="previousmonth" /></button>
                <button className="button" onClick={() => { this.forwardMonth(); }}><Translate id="nextmonth" /></button>
              </div>
            </div>

            {chunkedCalendar.map(week => (
              <div className="column is-12 columns is-marginless">
                {week.map((day, dayIndex) => {
                  if (day.empty) {
                    return (
                      <div key={`calendar-day-${dayIndex}`} className="column is-paddingless is-marginless is-hidden-mobile" />
                    );
                  }
                  return (
                    <div key={`calendar-day-${dayIndex}`} className={`column is-paddingless is-marginless ${_.isEmpty(day.eventsForDay) && 'is-hidden-mobile'}`}>
                      <div className="card calendar-day" onClick={() => { this.openModalForDay(day); }}>
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
                            {day.eventsForDay.map((eventEntry) => {
                              const event = eventEntry.value;
                              const eventLogo = categories[event.category].image;
                              return (
                                <img className="image is-24x24 calendar-image" src={eventLogo} alt="" />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
}


EventCalendar.propTypes = {
  events: PropTypes.array,
  participations: PropTypes.object,
  profile: PropTypes.object,
  categories: PropTypes.object,
  settings: PropTypes.object,
  uploadedCategoryLogos: PropTypes.object,
  activeLanguage: PropTypes.string,
};
