import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import moment from 'moment';
import { History } from 'history';
import { EditableEventContainer as EditableEvent } from './EditableEvent-container';
import { Category } from '~/models/Category';
import { TourmericEvent } from '~/models/Events';

interface Props {
  showNewEventButton: boolean;
  events: { [key: string]: TourmericEvent };
  categories: { [key: string]: Category };
  published: boolean;
  history: History;
  setReturnLocation: (returnLocation: string) => void;
}

interface State {
  activeFilter: string;
  showPastEvents: boolean;
}

export class AdminEventList extends Component<Props, State> {

  state = { activeFilter: '', showPastEvents: false };

  changeFilter(value: string) {
    this.setState({ activeFilter: value });
  }

  async addEvent() {
    const { history, setReturnLocation } = this.props;
    await setReturnLocation(history.location.pathname);

    const randomDraft = `NEW-${Math.round(Math.random() * 10000)}`;
    history.push(`/admin/events/newevent/${randomDraft}`);
  }

  addFilterField() {
    return (
      <div className="field is-horizontal">
        <label className="field-label is-normal">
          <Translate id="filter" />
        </label>
        <Translate>
          {(translate: any) => (
            <input className="input" type="text" value={this.state.activeFilter} placeholder={translate('filtereventsbynameorcategory')} onChange={(event) => this.changeFilter(event.target.value)} />
          )}
        </Translate>
      </div>
    );
  }

  filterList(sortedList: [string, TourmericEvent][]) {
    const { categories } = this.props;

    const pastOrFutureList = sortedList.filter((item) => {
      if (this.state.showPastEvents) {
        return !item[1].date || moment(item[1].date, 'YYYY-MM-DD').isBefore(moment());
      }
      return !item[1].date || moment(item[1].date, 'YYYY-MM-DD').isSameOrAfter(moment());
    });

    const filteredList = _.isEmpty(this.state.activeFilter) || _.isEmpty(sortedList) ?
      pastOrFutureList :
      pastOrFutureList.filter((item) => {
        const lowerCaseFilter = this.state.activeFilter.toLowerCase();
        const hasName = !!item[1].name;
        const nameFilterHits = hasName && item[1].name.toLowerCase().indexOf(lowerCaseFilter) !== -1;

        const hasCategory = !!item[1].category;
        const actualCategory = hasCategory ? categories[item[1].category] : '...';
        const categoryFilterHits = hasCategory && actualCategory !== '...' && (
          actualCategory.name.toLowerCase().indexOf(lowerCaseFilter) !== -1 ||
          actualCategory.abbreviation.toLowerCase().indexOf(lowerCaseFilter) !== -1
        );

        return categoryFilterHits || nameFilterHits;
      });

    return filteredList;
  }

  listEditableEvents(eventList: [string, TourmericEvent][]) {

    const sortedList = _.sortBy(eventList, [(e) => e[1].date]).reverse();
    const filteredList = this.filterList(sortedList);
    const result = filteredList.map((tournament, index) => <EditableEvent tournamentEntry={tournament} key={tournament[0]} index={index} />);
    return (
      <div className="columns is-multiline">
        {result}
      </div>
    );
  }

  render() {
    const { events, published } = this.props;

    if (_.isEmpty(events)) {
      return (
        <div className="section">
          <div className="columns">
            {this.props.showNewEventButton &&
              <button className="button is-small" onClick={() => this.addEvent()}>
                <Translate id="addevent" />
              </button>
            }
          </div>
          <div><Translate id="noevents" /></div>
        </div>
      );
    }

    const sortedEvents: [string, TourmericEvent][] = _.sortBy(Object.entries(events), ['date', 'time']);
    const filteredEvents: [string, TourmericEvent][] = sortedEvents.filter((event) => !!event[1].published === !!published);

    return (
      <div>
        <div className="columns">
          <div className="column">
            {this.props.showNewEventButton &&
              <button className="button is-small" onClick={() => this.addEvent()}>
                <Translate id="addevent" />
              </button>
            }
          </div>
          <div className="column">
            <div className="field is-horizontal">

              <div className="field-label is-normal">
                <label><Translate id="showing" /></label>
              </div>
              <div className="field-body">
                <button
                  className={`button is-small ${!this.state.showPastEvents && 'is-success'}`}
                  onClick={() => this.setState({ showPastEvents: false })}
                ><Translate id="future" />
                </button>
                <button
                  className={`button is-small ${this.state.showPastEvents && 'is-success'}`}
                  onClick={() => this.setState({ showPastEvents: true })}
                ><Translate id="past" />
                </button>
              </div>

            </div>
          </div>
          <div className="column is-6">
            {this.addFilterField()}
          </div>
        </div>
        <p>&nbsp;</p>
        {this.listEditableEvents(filteredEvents)}
      </div>
    );
  }
}
