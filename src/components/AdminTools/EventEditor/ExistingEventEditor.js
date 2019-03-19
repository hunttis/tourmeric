import React, { Component } from 'react';
import firebase from 'firebase/app';

import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { Translate } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';

import EditorForm from './EditorForm-container';
import { checkTimeStringFormat } from '../../Common/Utils';

export default class ExistingEventEditor extends Component {

  constructor(props) {
    super(props);

    this.state = { processing: false, deleteConfirmation: false };

    window.scrollTo(0, 0);

    if (props.eventId.startsWith('DRAFT') && !props.event) {
      const date = props.eventId.substr(6);
      firebase.update(`/events/${props.eventId}`, { createDate: moment().toISOString(), date });
    } else if (!props.event) {
      firebase.update(`/events/${props.eventId}`, { createDate: moment().toISOString() });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState)) {
      return false;
    }
    return true;
  }

  updateCategory(key, empty, data) {
    const { categories, event, eventId } = this.props;

    const selectedCategory = data ? categories[data] : { formats: [] };
    if (event.format && _.isEmpty(selectedCategory.formats)) {
      firebase.update(`/events/${eventId}`, { format: null });
    }
  }

  async saveEvent() {
    const { eventId, event, categories } = this.props;

    const dataToSave = _.cloneDeep(event);
    dataToSave.published = true;

    if (!_.get(categories, `${dataToSave.category}.formats`, false)) {
      dataToSave.format = null;
    }

    await this.setState({ processing: true });

    if (event.eventType === 'ongoingevent') {
      await firebase.push('/eventsongoing', dataToSave);
    } else {
      await firebase.push('/events', dataToSave);
    }


    await firebase.set(`/events/${eventId}`, {});
    this.goBack();
  }

  checkMissingFields() {
    const { event } = this.props;

    if (!isLoaded(event)) {
      return [];
    }

    const cleanFormatOptions = this.cleanFormatOptions();
    const cleanFormatOptionsLength = Object.keys(cleanFormatOptions).length;

    const nameOk = !!event.name;
    const categoryOk = !!event.category;
    const formatOk = !!event.category && (cleanFormatOptionsLength === 0 || (cleanFormatOptionsLength > 0 && !!event.format));
    const timeOk = !!event.time && checkTimeStringFormat(event.time);

    const entryFeeOk = !_.isEmpty(event.entryFee);

    const missingFields = [];
    if (!nameOk) {
      missingFields.push('name');
    }
    if (!categoryOk) {
      missingFields.push('category');
    }
    if (!formatOk) {
      missingFields.push('format');
    }
    if (!timeOk) {
      missingFields.push('time');
    }
    if (!entryFeeOk) {
      missingFields.push('entryfee');
    }

    return missingFields;
  }

  cleanFormatOptions() {
    const { categories, event } = this.props;

    if (!isLoaded(event)) {
      return {};
    }

    const selectedCategory = event.category ? categories[event.category] : { formats: [] };
    const formatOptions = _.isEmpty(selectedCategory.formats) ? [] : selectedCategory.formats.split(',');

    const cleanedFormatOptions = {};

    for (const option of formatOptions) {
      const trimmedName = _.trim(option);
      cleanedFormatOptions[trimmedName] = trimmedName;
    }

    return cleanedFormatOptions;
  }

  async deleteEvent() {
    const { deleteConfirmation } = this.state;

    if (!deleteConfirmation) {
      this.setState({ deleteConfirmation: true });
      return;
    }

    const { eventId } = this.props;

    await this.setState({ processing: true });
    await firebase.set(`/events/${eventId}`, {});
    this.goBack();
  }

  async hideEvent() {
    const { eventId } = this.props;
    await firebase.update(`/events/${eventId}`, { published: false });
  }

  async publishEvent() {
    const { eventId } = this.props;
    await firebase.update(`/events/${eventId}`, { published: true });
  }

  async goBack() {
    const { history, returnLocation } = this.props;
    await history.push(returnLocation);
  }

  render() {
    const { processing, deleteConfirmation } = this.state;
    const { eventId, categories, event } = this.props;

    moment.locale('fi');

    if (!isLoaded(categories) && !isLoaded(event)) {
      return <div>Loading..</div>;
    }

    if (processing) {
      return (
        <div>Processing..</div>
      );
    }

    const cleanedFormatOptions = this.cleanFormatOptions();
    const missingFields = this.checkMissingFields();
    const newEvent = eventId.startsWith('DRAFT') || eventId.startsWith('NEW');
    const allowDateEdit = !eventId.startsWith('DRAFT');

    return (
      <div className="section">
        <h1 className="title">
          {newEvent && <Translate id="newevent" />}
          {!newEvent && <Translate id="editevent" />}
        </h1>
        <EditorForm
          eventId={eventId}
          event={event || {}}
          cleanedFormatOptions={cleanedFormatOptions}
          newEvent={newEvent}
          missingFields={missingFields}
          updateFieldStatus={() => {}}
          updateCategory={(key, empty, data) => this.updateCategory(key, empty, data)}
          allowDateEdit={allowDateEdit}
          saveEvent={() => this.saveEvent()}
          deleteEvent={() => this.deleteEvent()}
          deleteConfirmation={deleteConfirmation}
          goBack={() => this.goBack()}
        />
      </div>
    );

  }
}

ExistingEventEditor.propTypes = {
  categories: PropTypes.object,
  eventId: PropTypes.string,
  history: PropTypes.object,
  event: PropTypes.object,
  returnLocation: PropTypes.string.isRequired,
};
