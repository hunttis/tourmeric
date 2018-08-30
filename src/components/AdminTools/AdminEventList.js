import React, { Component, Fragment } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import moment from 'moment';
import _ from 'lodash';
import PropTypes from 'prop-types';
import EditableEvent from './EditableEvent-container';

export default class AdminEventList extends Component {

  state = { activeFilter: '' };

  changeFilter(value) {
    this.setState({ activeFilter: value });
  }

  addEventButton() {
    return (
      <div className="column is-6">
        <div className="field">
          <button
            className="button"
            onClick={() => {
              firebase.push('/events', { createDate: moment().toISOString(), date: moment().format('YYYY-MM-DD') });
            }}
          >
            <Translate id="addevent" />
          </button>
        </div>
      </div>
    );
  }

  addFilterField() {
    return (
      <Fragment>
        <div className="column is-6">
          <div className="field is-horizontal">
            <label className="field-label is-normal">
              <Translate id="filter" />
            </label>
            <Translate>
              {translate => (
                <input className="input" type="text" value={this.state.creditFormNote} placeholder={translate('filtereventsbynameorcategory')} onChange={event => this.changeFilter(event.target.value)} />
              )}
            </Translate>
          </div>
        </div>
      </Fragment>
    );
  }

  filterList(sortedList) {
    const { categories } = this.props;

    const filteredList = _.isEmpty(this.state.activeFilter) || _.isEmpty(sortedList) ?
      sortedList :
      sortedList.filter((item) => {
        const lowerCaseFilter = this.state.activeFilter.toLowerCase();
        const hasName = !!item[1].name;
        const nameFilterHits = hasName && item[1].name.toLowerCase().indexOf(lowerCaseFilter) !== -1;

        const hasCategory = !!item[1].category;
        const actualCategory = hasCategory ? categories[item[1].category] : '...';
        const categoryFilterHits = hasCategory && (
          actualCategory.name.toLowerCase().indexOf(lowerCaseFilter) !== -1 ||
          actualCategory.abbreviation.toLowerCase().indexOf(lowerCaseFilter) !== -1
        );

        return categoryFilterHits || nameFilterHits;
      });

    return filteredList;
  }

  listEditableEvents(eventList) {
    if (_.isEmpty(eventList)) {
      return <div><Translate id="noevents" /></div>;
    }
    const sortedList = _.sortBy(eventList, [e => e[1].date]).reverse();
    const filteredList = this.filterList(sortedList);

    return (
      <div className="columns is-multiline">
        {filteredList.map((tournament, index) => <EditableEvent tournamentEntry={tournament} key={tournament[0]} index={index} />)}
      </div>
    );
  }

  render() {
    const { events, published } = this.props;
    const sortedEvents = _.sortBy(Object.entries(events), ['date', 'time']);
    const filteredEvents = sortedEvents.filter(event => !!event[1].published === !!published);

    return (
      <div>
        <div className="columns">
          {this.props.showNewEventButton && this.addEventButton()}
          {this.addFilterField()}
        </div>
        <p>&nbsp;</p>
        {this.listEditableEvents(filteredEvents)}
      </div>);
  }
}

AdminEventList.propTypes = {
  showNewEventButton: PropTypes.bool,
  events: PropTypes.object,
  categories: PropTypes.object,
  published: PropTypes.bool,
};
