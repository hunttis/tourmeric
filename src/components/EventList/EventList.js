import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import EventCard from './EventCard-container';
import { EventModal } from './EventModal';

export default class EventList extends Component {

  constructor(props) {
    super(props);

    this.state = { categoryFilter: [], showPastEventsFilter: false };

    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
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

    const potentialEvents = this.state.showPastEventsFilter ?
      Object.values(events).filter(event => moment(event.value.date).isBefore(moment())) :
      Object.values(events).filter(event => moment(event.value.date).isAfter(moment()));

    const publishedEvents = potentialEvents.filter(event => event.value.published);
    if (_.isEmpty(categoryFilter)) {
      return publishedEvents;
    }

    const publishedAndFilteredEvents = publishedEvents.filter(event => _.includes(this.state.categoryFilter, event.value.category));
    return publishedAndFilteredEvents;
  }

  closeModal(eventId) {
    const modal = document.getElementById(`modal${eventId}`);
    modal.classList.remove('is-active');
  }

  openModal(eventId) {
    const modal = document.getElementById(`modal${eventId}`);
    modal.classList.add('is-active');
  }

  togglePastEventFilter() {
    const { showPastEventsFilter } = this.state;
    this.setState({ showPastEventsFilter: !showPastEventsFilter });
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

  render() {
    const {
      events, participations, profile, categories, settings, uploadedCategoryLogos,
    } = this.props;

    if (!isLoaded(participations) || !isLoaded(profile) || !isLoaded(events) || !isLoaded(settings) || !isLoaded(uploadedCategoryLogos)) {
      return <div><Translate id="loading" /></div>;
    } if (isLoaded(events) && isEmpty(events)) {
      return <div><Translate id="noevents" /></div>;
    }
    const publishedEvents = this.runEventFilters(events);
    const pastFilterClass = `button is-rounded is-fullwidth ${this.state.showPastEventsFilter ? 'is-primary' : ''} high-button`;

    const categoryNames = this.state.categoryFilter.map(category => categories[category].name).join(', ');

    return (
      <section className="section">
        <div className="container">

          {isLoaded(events) && publishedEvents.map((eventEntry) => {
            const eventId = eventEntry.key;
            const eventContent = eventEntry.value;
            const participationsForEvent = Object.values(_.get(participations, eventId, []));

            return <EventModal key={`modal${eventId}`} eventId={eventId} eventContent={eventContent} closeModal={() => this.closeModal(eventId)} participations={participationsForEvent} />;
          })}

          <h1 className="title"><Translate id="nextevents" /></h1>

          <div className="columns is-multiline">
            <div className="column is-2" />
            <div className="column is-8">

              <Translate>
                { translate => (
                  <div>
                    {translate('currentlyshowing')}
                    {_.isEmpty(this.state.categoryFilter) && !this.state.showPastEventsFilter ? translate('all') : translate('only')} {this.state.showPastEventsFilter ? <span className="has-text-warning"><Translate id="past" /></span> : translate('future')} <span className="has-text-success">{categoryNames}</span> {translate('events')}
                  </div>
                )}
              </Translate>

            </div>
            <div className="column is-2 is-hidden-mobile" />
            <div className="column is-2 is-hidden-mobile" />

            <div className="column is-8 columns is-multiline is-mobile">
              {isLoaded(categories) && Object.entries(categories).map((categoryEntry) => {
                const activeStatus = _.includes(this.state.categoryFilter, categoryEntry[0]) ? 'is-primary' : '';
                const buttonClass = `button is-rounded image-square ${activeStatus} `;

                const category = categories[categoryEntry[0]];
                const logo = category.logo ? uploadedCategoryLogos[category.logo] : null;

                return (
                  <div key={`categoryfilter-${categoryEntry[0]}`} className="column is-3 is-one-quarter-desktop is-one-quarter-tablet is-one-third-mobile has-text-centered">
                    <button
                      className={buttonClass}
                      onClick={() => this.toggleFilter(categoryEntry[0])}
                    >
                      <img className="image is-48x48" src={logo.downloadURL} alt="" />
                    </button>
                  </div>
                );
              })
                  }
            </div>
            <div className="column is-2" />
          </div>
          <div className="columns is-multiline">
            <div className="column is-2" />
            <div className="column is-2 is-12-mobile">
              <button
                className={pastFilterClass}
                data-tooltip="showpastevents"
                onClick={() => this.togglePastEventFilter()}
              ><Translate id="showpastevents" />
              </button>
            </div>
          </div>

          <div className="columns is-multiline">
            {isLoaded(events) && publishedEvents.map((eventEntry) => {
              const eventId = eventEntry.key;

              return (
                <div key={eventId} className="column is-12 columns">
                  <div className="column is-2" />
                  <EventCard
                    eventId={eventId}
                    openModal={() => this.openModal(eventId)}
                  />
                  <div className="column is-2" />
                </div>
              );

            })}
          </div>
        </div>
      </section>
    );
  }
}


EventList.propTypes = {
  events: PropTypes.array,
  participations: PropTypes.object,
  profile: PropTypes.object,
  categories: PropTypes.object,
  settings: PropTypes.object,
  uploadedCategoryLogos: PropTypes.object,
};
