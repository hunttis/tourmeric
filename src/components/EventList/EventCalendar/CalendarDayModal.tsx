import React, { Component } from 'react';
import { isLoaded } from 'react-redux-firebase';
import _ from 'lodash';
import { History } from 'history';
import { Translate } from 'react-localize-redux';
import { Moment } from 'moment/min/moment-with-locales';
import {
  removeClassFromHtml,
  addClassToHtml,
} from '../../Common/DocumentUtils';
import EventCard from '../EventCard/EventCard-container';
import { OpeningHoursContainer as OpeningHours } from '../../StoreInfo/OpeningHours-container';
import { OpeningHoursExceptionEditor } from './OpeningHoursExceptionEditor';
import { OpeningHoursException } from '../../../models/OpeningHours';
import { getOngoingEventsForDay, getEventsForDay } from '~/components/Common/EventUtils';

export interface Props {
  history: History;
  setReturnLocation: (returnLocation: string) => void;
  backToCalendar: () => void;
  showArrow: boolean;
  momentForDay: Moment;
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

  componentWillMount() {
    addClassToHtml('is-clipped');
  }

  componentWillUnmount() {
    if (this.scrollElement) {
      this.scrollElement.removeEventListener(
        'scroll',
        this.checkStateShouldShowArrow,
      );
    }
    removeClassFromHtml('is-clipped');
  }

  closeExceptionEditor() {
    this.setState({ editingException: false });
  }

  toggleExceptionEditor() {
    this.setState((prevState: State) => ({
      editingException: !prevState.editingException,
    }));
  }

  async goToEventEditor(momentForDay: Moment) {
    const { history, setReturnLocation } = this.props;
    await setReturnLocation(history.location.pathname);
    history.push(`/admin/events/newevent/${momentForDay.format('YYYY-MM-DD')}`);
  }


  updateScrollRef = (element: HTMLDivElement) => {
    if (element) {
      this.scrollElement = element;
      this.checkStateShouldShowArrow();
      element.addEventListener('scroll', this.checkStateShouldShowArrow);
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
    const { backToCalendar, momentForDay, isAdmin, openinghoursexceptions, categoryFilter } = this.props;
    const { editingException } = this.state;

    const exceptionForDayExists =
      isLoaded(openinghoursexceptions) &&
      openinghoursexceptions[momentForDay.format('YYYY-MM-DD')];

    const eventsForDay = _.sortBy(getEventsForDay(momentForDay, true), (event) => _.padStart(event.value.time, 5, '0'));
    const ongoingEventsForDay = _.sortBy(getOngoingEventsForDay(momentForDay, true), (event) => _.padStart(event.value.time, 5, '0'));
    const allEventsForDay = _.concat(eventsForDay, ongoingEventsForDay).filter((event) => categoryFilter.includes(event.value.category));

    return (
      <>
        <div className="modal is-active">
          <div
            className="modal-background"
            onClick={() => backToCalendar()}
          />
          <div className="modal-content box" ref={this.updateScrollRef}>
            {this.state.showArrow && (
              <div className="more-to-scroll">
                <i className="fas fa-angle-double-down" />
              </div>
            )}

            <div className="columns is-multiline">
              <div className="column is-6">
                <h2 className="subtitle is-capitalized">
                  {momentForDay.format('dddd, MMMM YYYY')}
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
                    <Translate id="addevent" />
                  </button>
                )}
              </div>
              {!editingException && (
                <div className="column is-8">
                  <OpeningHours day={momentForDay.format('YYYY-MM-DD')} />
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
                        <Translate id="modifyexception" />
                      </span>
                    )}
                    {!editingException && !exceptionForDayExists && (
                      <span>
                        <Translate id="addexception" />
                      </span>
                    )}
                    {editingException && (
                      <span>
                        <Translate id="exception" /> <Translate id="done" />
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
            <p>&nbsp;</p>
            {_.isEmpty(allEventsForDay) && (
              <p>
                <Translate id="noeventsforthisday" />
              </p>
            )}
            {!_.isEmpty(allEventsForDay) && (
              <>
                <h2 className="subtitle">
                  <Translate id="eventsfortoday" />
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
