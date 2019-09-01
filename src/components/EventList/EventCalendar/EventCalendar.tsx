import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import moment, { Moment } from 'moment/min/moment-with-locales';
import { History } from 'history';
import { CalendarMonth } from './CalendarMonth';
import {
  removeClassFromHtml,
} from '../../Common/DocumentUtils';
import CalendarDayModal from './CalendarDayModal-container';
import { Location } from '~/models/ReduxState';
import { Settings } from '~/models/Settings';
import { Category } from '~/models/Category';
import { OpeningHoursException } from '~/models/OpeningHours';
import { TourmericEvent } from '~/models/Events';
import { Day } from '~/models/Calendar';
import { parseInformationForMonthYear } from './CalendarUtils';

const YEAR_INDEX = 2;
const MONTH_INDEX = 3;
const DAY_INDEX = 4;

const MODE_MONTH: ViewMode = 'month';
const MODE_DAY: ViewMode = 'day';

type ViewMode = 'month' | 'day';

interface Props {
  settings: Settings;
  events: { key: string, value: TourmericEvent }[];
  eventsongoing: { key: string, value: TourmericEvent }[];
  categories: { [key: string]: Category };
  activeLanguage: string;
  location: Location;
  history: History;
  openinghoursexceptions: { [key: string]: OpeningHoursException };
  setReturnLocation: (key: string) => void;
}

interface State {
  targetMonth: string;
  targetYear: string;
  targetDay: string;
  mode: ViewMode;
  categoryFilter: string[];
}

export default class EventCalendar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const favoriteCategories = _.get(props, 'profile.favoriteCategories', '');
    const defaultFilter = favoriteCategories.split(' ');

    const targetData = this.parseTargetMonthYearAndMode(props.location);

    this.state = {
      categoryFilter: _.compact(defaultFilter),
      ...targetData,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!_.isEqual(this.props.location, nextProps.location)) {
      const targetData = this.parseTargetMonthYearAndMode(nextProps.location);
      this.setState({ ...targetData });
    }
  }

  componentWillUnmount() {
    removeClassFromHtml('is-clipped');
  }

  parseTargetMonthYearAndMode(location: Location) {
    let targetYear = moment().format('YYYY');
    let targetMonth = moment().format('MM');
    let targetDay = moment().format('DD');
    let mode: ViewMode = MODE_MONTH;

    const splitPath = location.pathname.split('/');
    const pathLength = splitPath.length;

    removeClassFromHtml('is-clipped');

    if (pathLength === 2) {
      mode = MODE_MONTH;
    } else if (pathLength < 5) {
      targetYear = _.get(splitPath, YEAR_INDEX, targetYear);
      targetMonth = _.get(splitPath, MONTH_INDEX, targetMonth);
      mode = MODE_MONTH;
    } else if (pathLength === 5) {
      targetYear = _.get(splitPath, YEAR_INDEX, targetYear);
      targetMonth = _.get(splitPath, MONTH_INDEX, targetMonth);
      targetDay = _.get(splitPath, DAY_INDEX, targetDay);
      mode = MODE_DAY;
    }

    return { targetYear, targetMonth, targetDay, mode };
  }

  toggleFilter(categoryId: string) {
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

  runEventFilters(events: { key: string, value: TourmericEvent }[]) {
    const { categoryFilter } = this.state;

    const publishedEvents = events.filter((event) => event.value.published);
    if (_.isEmpty(categoryFilter)) {
      return publishedEvents;
    }

    const publishedAndFilteredEvents = publishedEvents.filter((event) => _.includes(this.state.categoryFilter, event.value.category));
    return publishedAndFilteredEvents;
  }

  modalItem(translationKey: string, content: string) {
    if (content) {
      return (
        <div className="column is-12">
          <div className="title">
            <Translate id={translationKey} />
          </div>
          <p>{content}</p>
        </div>
      );
    }
    return <div />;
  }

  forwardMonth() {
    const newMonth = moment(
      `${this.state.targetMonth}-${this.state.targetYear}`,
      'MM-YYYY',
    ).add(1, 'month');
    this.props.history.push(`/events/${newMonth.format('YYYY/MM')}`);
  }

  backMonth() {
    const newMonth = moment(
      `${this.state.targetMonth}-${this.state.targetYear}`,
      'MM-YYYY',
    ).subtract(1, 'month');
    this.props.history.push(`/events/${newMonth.format('YYYY/MM')}`);
  }

  clickDay(day: Day) {
    this.props.history.push(`/events/${day.dayLink}`);
  }

  backToCalendar = () => {
    this.props.history.push(
      `/events/${this.state.targetYear}/${this.state.targetMonth}`,
    );
  }

  chunkedCalendar(calendar: Day[]) {
    const chunkedCalendar = _.chunk(calendar, 7);
    while (chunkedCalendar[chunkedCalendar.length - 1].length < 7) {
      chunkedCalendar[chunkedCalendar.length - 1].push({ empty: true });
    }
    return chunkedCalendar;
  }

  async goToEventEditor(momentForDay: Moment) {
    const { history, setReturnLocation } = this.props;
    await setReturnLocation(history.location.pathname);
    history.push(`/admin/events/newevent/${momentForDay.format('YYYY-MM-DD')}`);
  }

  render() {
    const {
      events,
      eventsongoing,
      categories,
      activeLanguage,
      location,
      openinghoursexceptions,
      settings,
    } = this.props;

    const { targetMonth, targetYear, mode } = this.state;

    if (!isLoaded(events) || !isLoaded(categories)) {
      return (
        <div className="is-loading">
          <Translate id="loading" />
        </div>
      );
    }
    if (isLoaded(events) && isEmpty(events)) {
      return (
        <div>
          <Translate id="noevents" />
        </div>
      );
    }

    moment.locale(activeLanguage);

    const calendar = parseInformationForMonthYear(targetMonth, targetYear, events, eventsongoing);
    const chunkedCalendar = this.chunkedCalendar(calendar);

    const categoryNames = this.state.categoryFilter
      .map((category) => categories[category].name)
      .join(', ');

    const dayInPath = location.pathname.substring('/events/'.length);

    const eventsForDay =
      mode === MODE_DAY
        ? _.get(_.find(calendar, { dayLink: dayInPath }), 'eventsForDay', [])
        : [];

    const ongoingEventsForDay =
      mode === MODE_DAY
        ? _.get(
          _.find(calendar, { dayLink: dayInPath }),
          'ongoingEventsForDay',
          [],
        )
        : [];

    const momentForDay = mode === MODE_DAY && moment(dayInPath, 'YYYY/MM/DD');

    return (
      <section className="section">

        {mode === MODE_DAY &&
          <CalendarDayModal
            backToCalendar={this.backToCalendar}
            momentForDay={momentForDay}
            eventsForDay={eventsForDay}
            ongoingEventsForDay={ongoingEventsForDay}
          />
        }

        <div className="container">
          <h1 className="title">
            <Translate id="nextevents" />
          </h1>

          <div className="columns is-multiline">
            <div className="column is-12">
              <Translate id="filtereventsbychoosingcategories" />
              <Translate>
                {(translate: any) => (
                  <div>
                    {translate('currentlyshowing')}
                    {_.isEmpty(this.state.categoryFilter)
                      ? translate('all')
                      : translate('only')}{' '}
                    <span className="has-text-success">{categoryNames}</span>{' '}
                    {translate('events')}
                  </div>
                )}
              </Translate>
            </div>

            <div className="column is-12 is-mobile has-text-centered">
              {isLoaded(categories) &&
                Object.entries(categories).map((categoryEntry) => {
                  const activeStatus = _.includes(
                    this.state.categoryFilter,
                    categoryEntry[0],
                  )
                    ? 'is-primary'
                    : '';
                  const buttonClass = `button is-grouped ${activeStatus}`;

                  const category = categories[categoryEntry[0]];

                  return (
                    <div
                      key={`categoryfilter-${categoryEntry[0]}`}
                      className="is-one-quarter-desktop is-one-quarter-tablet is-one-third-mobile has-text-centered is-inline-flex"
                    >
                      <button
                        className={`${buttonClass} is-hidden-mobile image-square`}
                        onClick={() => this.toggleFilter(categoryEntry[0])}
                      >
                        <img
                          className="image is-48x48"
                          src={category.imageSmall ? category.imageSmall : category.image}
                          alt=""
                        />
                      </button>
                      <button
                        className={`${buttonClass} is-hidden-tablet`}
                        onClick={() => this.toggleFilter(categoryEntry[0])}
                      >
                        <img
                          className="image is-24x24"
                          src={category.imageSmall ? category.imageSmall : category.image}
                          alt=""
                        />
                      </button>
                    </div>
                  );
                })}
            </div>

            <div className="column is-6">
              <h1 className="title">
                {_.capitalize(
                  moment(`${targetMonth}-${targetYear}`, 'MM-YYYY').format(
                    'MMMM',
                  ),
                )}
              </h1>
            </div>
            <div className="column is-6">
              <div className="buttons has-addons is-right">
                <button
                  className="button"
                  onClick={() => {
                    this.backMonth();
                  }}
                >
                  <Translate id="previousmonth" />
                </button>
                <button
                  className="button"
                  onClick={() => {
                    this.forwardMonth();
                  }}
                >
                  <Translate id="nextmonth" />
                </button>
              </div>
            </div>

            <CalendarMonth
              chunkedCalendar={chunkedCalendar}
              categories={categories}
              clickDay={(day: Day) => this.clickDay(day)}
              openinghoursexceptions={openinghoursexceptions}
              settings={settings}
            />
          </div>
        </div>
      </section>
    );
  }
}
