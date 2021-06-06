import React, { Component } from "react";
import { isLoaded } from "react-redux-firebase";
import _ from "lodash";
import { History } from "history";
import { FormattedMessage, IntlShape } from "react-intl";
import {
  removeClassFromHtml,
  addClassToHtml,
} from "../../Common/DocumentUtils";
import EventCard from "../EventCard/EventCard-container";
import OpeningHours from "../../StoreInfo/OpeningHours-container";
import { OpeningHoursExceptionEditor } from "./OpeningHoursExceptionEditor";
import { OpeningHoursException } from "../../../models/OpeningHours";
import {
  getOngoingEventsForDay,
  getEventsForDay,
} from "../../../components/Common/EventUtils";
import { format } from "date-fns";

export interface Props {
  history: History;
  setReturnLocation: (returnLocation: string) => void;
  backToCalendar: () => void;
  showArrow: boolean;
  momentForDay: Date;
  isAdmin: boolean;
  openinghoursexceptions: { [key: string]: OpeningHoursException };
  categoryFilter: string[];
}

export interface State {
  showArrow: boolean;
  editingException: boolean;
}

export class CalendarDayModal extends Component<Props, State> {
  state = { showArrow: false, editingException: false };

  scrollElement: HTMLDivElement | null;

  constructor(props: Props) {
    super(props);
    this.scrollElement = null;
  }

  componentDidMount() {
    addClassToHtml("is-clipped");
  }

  componentWillUnmount() {
    if (this.scrollElement) {
      this.scrollElement.removeEventListener(
        "scroll",
        this.checkStateShouldShowArrow
      );
    }
    removeClassFromHtml("is-clipped");
  }

  closeExceptionEditor() {
    this.setState({ editingException: false });
  }

  toggleExceptionEditor() {
    this.setState((prevState: State) => ({
      editingException: !prevState.editingException,
    }));
  }

  async goToEventEditor(momentForDay: Date) {
    const { history, setReturnLocation } = this.props;
    await setReturnLocation(history.location.pathname);
    history.push(
      `/admin/events/newevent/${format(momentForDay, "yyyy-MM-dd")}`
    );
  }

  updateScrollRef = (element: HTMLDivElement) => {
    if (element) {
      this.scrollElement = element;
      this.checkStateShouldShowArrow();
      element.addEventListener("scroll", this.checkStateShouldShowArrow);
    }
  };

  checkStateShouldShowArrow = () => {
    const element = this.scrollElement;
    this.setState({
      showArrow:
        element!.scrollTop <= element!.scrollHeight - window.innerHeight - 10,
    });
  };

  render() {
    const {
      backToCalendar,
      momentForDay,
      isAdmin,
      openinghoursexceptions,
      categoryFilter,
    } = this.props;
    const { editingException } = this.state;

    const exceptionForDayExists =
      isLoaded(openinghoursexceptions) &&
      openinghoursexceptions[format(momentForDay, "yyyy-MM-dd")];

    const eventsForDay = _.sortBy(
      getEventsForDay(momentForDay, true),
      (event) => _.padStart(event.value.time, 5, "0")
    );
    const ongoingEventsForDay = _.sortBy(
      getOngoingEventsForDay(momentForDay, true),
      (event) => _.padStart(event.value.time, 5, "0")
    );
    const allEventsForDay = _.concat(eventsForDay, ongoingEventsForDay).filter(
      (event) =>
        _.isEmpty(categoryFilter) ||
        categoryFilter.includes(event.value.category)
    );

    return (
      <>
        <div className="modal is-active">
          <div className="modal-background" onClick={() => backToCalendar()} />
          <div className="modal-content box" ref={this.updateScrollRef}>
            {this.state.showArrow && (
              <div className="more-to-scroll">
                <i className="fas fa-angle-double-down" />
              </div>
            )}

            <div className="columns is-multiline">
              <div className="column is-6">
                <h2 className="subtitle is-capitalized">
                  {format(momentForDay, "EEEE, d. MMMM yyyy")}
                </h2>
              </div>
              <div className="column is-6 has-text-right">
                {isAdmin && (
                  <button
                    className="button has-icons-left"
                    onClick={() => {
                      this.goToEventEditor(momentForDay);
                    }}
                  >
                    <i className="fas fa-calendar" />
                    &nbsp;
                    <FormattedMessage id="addevent" />
                  </button>
                )}
              </div>
              {!editingException && (
                <div className="column is-8">
                  <OpeningHours day={format(momentForDay, "yyyy-MM-dd")} />
                </div>
              )}
              {editingException && (
                <div className="column is-8">
                  <OpeningHoursExceptionEditor
                    day={momentForDay}
                    existingExceptions={openinghoursexceptions}
                    closeEditor={() => this.closeExceptionEditor()}
                  />
                </div>
              )}

              <div className="column is-4 has-text-right">
                {isAdmin && (
                  <button
                    className="button has-icons-left"
                    onClick={() => {
                      this.toggleExceptionEditor();
                    }}
                  >
                    <span className="icon">
                      <i className="fas fa-toolbox" />
                    </span>
                    {!editingException && exceptionForDayExists && (
                      <span>
                        <FormattedMessage id="modifyexception" />
                      </span>
                    )}
                    {!editingException && !exceptionForDayExists && (
                      <span>
                        <FormattedMessage id="addexception" />
                      </span>
                    )}
                    {editingException && (
                      <span>
                        <FormattedMessage id="exception" />{" "}
                        <FormattedMessage id="done" />
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
            <p>&nbsp;</p>
            {_.isEmpty(allEventsForDay) && (
              <p>
                <FormattedMessage id="noeventsforthisday" />
              </p>
            )}
            {!_.isEmpty(allEventsForDay) && (
              <>
                <h2 className="subtitle">
                  <FormattedMessage id="eventsfortoday" />
                </h2>
                <div>
                  {allEventsForDay.map((eventEntry, index) => {
                    const eventId = eventEntry.key;
                    return (
                      <EventCard
                        key={`events-for-day-${index}`}
                        eventId={eventId}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={() => backToCalendar()}
          />
        </div>
      </>
    );
  }
}
