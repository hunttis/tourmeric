import React, { Component } from "react";
import { isLoaded, isEmpty } from "react-redux-firebase";
import _ from "lodash";
import { FormattedMessage, IntlShape } from "react-intl";
import { History } from "history";
import { CalendarMonth } from "../../../components/EventList/EventCalendar/CalendarMonth";
import { removeClassFromHtml } from "../../../components/Common/DocumentUtils";
import CalendarDayModal from "./CalendarDayModal-container";
import { Location, FirebaseProfile } from "../../../models/ReduxState";
import { Settings } from "../../../models/Settings";
import { Category } from "../../../models/Category";
import { OpeningHoursException } from "../../../models/OpeningHours";
import { TourmericEvent } from "../../../models/Events";
import { Day } from "../../../models/Calendar";
import { parseInformationForMonthYear } from "./CalendarUtils";
import { format, addMonths, subMonths, parse } from "date-fns";

const YEAR_INDEX = 2;
const MONTH_INDEX = 3;
const DAY_INDEX = 4;

const MODE_MONTH: ViewMode = "month";
const MODE_DAY: ViewMode = "day";

export type ViewMode = "month" | "day";

interface Props {
  settings: Settings;
  events: { key: string; value: TourmericEvent }[];
  eventsongoing: { key: string; value: TourmericEvent }[];
  categories: { [key: string]: Category };
  location: Location;
  history: History;
  openinghoursexceptions: { [key: string]: OpeningHoursException };
  setReturnLocation: (key: string) => void;
  profile: FirebaseProfile;
  intl: IntlShape;
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

    const targetData = this.parseTargetMonthYearAndMode(props.location);

    this.state = {
      categoryFilter: [],
      ...targetData,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (isEmpty(this.props.profile) && !isEmpty(nextProps.profile)) {
      const favoriteCategories = _.get(
        nextProps,
        "profile.favoriteCategories",
        ""
      );
      const defaultFilter = favoriteCategories.split(" ");
      this.setState({ categoryFilter: _.compact(defaultFilter) });
    }

    if (!_.isEqual(this.props.location, nextProps.location)) {
      const targetData = this.parseTargetMonthYearAndMode(nextProps.location);
      this.setState({ ...targetData });
    }
  }

  componentWillUnmount() {
    removeClassFromHtml("is-clipped");
  }

  parseTargetMonthYearAndMode(location: Location) {
    let targetYear = format(new Date(), "yyyy");
    let targetMonth = format(new Date(), "MM");
    let targetDay = format(new Date(), "dd");
    let mode: ViewMode = MODE_MONTH;

    const splitPath = location.pathname.split("/");
    const pathLength = splitPath.length;

    removeClassFromHtml("is-clipped");

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

  runEventFilters(events: { key: string; value: TourmericEvent }[]) {
    const { categoryFilter } = this.state;

    const publishedEvents = events.filter((event) => event.value.published);
    if (_.isEmpty(categoryFilter)) {
      return publishedEvents;
    }

    const publishedAndFilteredEvents = publishedEvents.filter((event) =>
      _.includes(this.state.categoryFilter, event.value.category)
    );
    return publishedAndFilteredEvents;
  }

  modalItem(translationKey: string, content: string) {
    if (content) {
      return (
        <div className="column is-12">
          <div className="title">
            <FormattedMessage id={translationKey} />
          </div>
          <p>{content}</p>
        </div>
      );
    }
    return <div />;
  }

  forwardMonth() {
    const originalMonth = parse(
      `${this.state.targetMonth}-${this.state.targetYear}`,
      "MM-yyyy",
      new Date()
    );
    const newMonth = addMonths(originalMonth, 1);
    this.props.history.push(`/events/${format(newMonth, "yyyy/MM")}`);
  }

  backMonth() {
    const originalMonth = parse(
      `${this.state.targetMonth}-${this.state.targetYear}`,
      "MM-yyyy",
      new Date()
    );
    const newMonth = subMonths(originalMonth, 1);
    this.props.history.push(`/events/${format(newMonth, "yyyy/MM")}`);
  }

  clickDay(day: Day) {
    this.props.history.push(`/events/${day.dayLink}`);
  }

  backToCalendar = () => {
    this.props.history.push(
      `/events/${this.state.targetYear}/${this.state.targetMonth}`
    );
  };

  chunkedCalendar(calendar: Day[]) {
    const chunkedCalendar = _.chunk(calendar, 7);
    while (chunkedCalendar[chunkedCalendar.length - 1].length < 7) {
      chunkedCalendar[chunkedCalendar.length - 1].push({ empty: true });
    }
    return chunkedCalendar;
  }

  async goToEventEditor(momentForDay: Date) {
    const { history, setReturnLocation } = this.props;
    await setReturnLocation(history.location.pathname);
    history.push(
      `/admin/events/newevent/${format(momentForDay, "yyyy-MM-dd")}`
    );
  }

  render() {
    const {
      events,
      eventsongoing,
      categories,
      location,
      openinghoursexceptions,
      settings,
      profile,
      intl,
    } = this.props;

    const { targetMonth, targetYear, mode, categoryFilter } = this.state;

    if (!isLoaded(events) || !isLoaded(categories) || !isLoaded(profile)) {
      return (
        <div className="is-loading">
          <FormattedMessage id="loading" />
        </div>
      );
    }
    if (isLoaded(events) && isEmpty(events)) {
      return (
        <div>
          <FormattedMessage id="noevents" />
        </div>
      );
    }

    {
      /* moment.locale(activeLanguage.code); */
    } // TODO Does this need fixing?

    const calendar = parseInformationForMonthYear(
      targetMonth,
      targetYear,
      events,
      eventsongoing,
      categoryFilter
    );
    const chunkedCalendar = this.chunkedCalendar(calendar);

    const categoryNames = this.state.categoryFilter
      .map((category) => categories[category].name)
      .join(", ");

    const dayInPath = location.pathname.substring("/events/".length);

    const momentForDay =
      mode === MODE_DAY && parse(dayInPath, "yyyy/MM/dd", new Date());

    return (
      <section className="section">
        {mode === MODE_DAY && (
          <CalendarDayModal
            backToCalendar={this.backToCalendar}
            momentForDay={momentForDay}
            categoryFilter={this.state.categoryFilter}
          />
        )}

        <div className="container">
          <h1 className="title">
            <FormattedMessage id="nextevents" />
          </h1>

          <div className="columns is-multiline">
            <div className="column is-12">
              <FormattedMessage id="filtereventsbychoosingcategories" />
              <div>
                {intl.formatMessage({ id: "currentlyshowing" })}
                {_.isEmpty(this.state.categoryFilter)
                  ? intl.formatMessage({ id: "all" })
                  : intl.formatMessage({ id: "only" })}{" "}
                <span className="has-text-success">{categoryNames}</span>{" "}
                {intl.formatMessage({ id: "events" })}
              </div>
            </div>

            <div className="column is-12 is-mobile has-text-centered">
              {isLoaded(categories) &&
                Object.entries(categories).map((categoryEntry) => {
                  const activeStatus = _.includes(
                    this.state.categoryFilter,
                    categoryEntry[0]
                  )
                    ? "is-primary"
                    : "";
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
                          src={
                            category.imageSmall
                              ? category.imageSmall
                              : category.image
                          }
                          alt=""
                        />
                      </button>
                      <button
                        className={`${buttonClass} is-hidden-tablet`}
                        onClick={() => this.toggleFilter(categoryEntry[0])}
                      >
                        <img
                          className="image is-24x24"
                          src={
                            category.imageSmall
                              ? category.imageSmall
                              : category.image
                          }
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
                  format(
                    parse(
                      `${targetMonth}-${targetYear}`,
                      "MM-yyyy",
                      new Date()
                    ),
                    "MMMM"
                  )
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
                  <FormattedMessage id="previousmonth" />
                </button>
                <button
                  className="button"
                  onClick={() => {
                    this.forwardMonth();
                  }}
                >
                  <FormattedMessage id="nextmonth" />
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
