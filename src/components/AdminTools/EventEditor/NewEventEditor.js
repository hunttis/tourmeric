import React, { Component } from 'react';
import firebase from 'firebase/app';

import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { Translate } from 'react-localize-redux';

import EditorForm from './EditorForm-container';

export default class NewEventEditor extends Component {

  constructor(props) {
    super(props);

    const draftContent = props.draftContent || {};

    if (!draftContent.date) {
      draftContent.date = props.draftDate.format('YYYY-MM-DD');
    }

    this.state = {
      eventId: props.draftID,
      draftContent,
      processing: false,
    };

    window.scrollTo(0, 0);
  }

  updateFieldStatus(key, empty, data) {
    this.setState((prevState) => {
      const newDraftData = _.cloneDeep(prevState.draftContent);
      newDraftData[key] = data;
      return { draftContent: newDraftData };
    });
  }


  checkMissingFields() {
    const { draftContent } = this.state;

    const cleanFormatOptions = this.cleanFormatOptions();
    const cleanFormatOptionsLength = Object.keys(cleanFormatOptions).length;

    const nameOk = !!draftContent.name;
    const categoryOk = !!draftContent.category;
    const formatOk = !!draftContent.category && (cleanFormatOptionsLength === 0 || (cleanFormatOptionsLength > 0 && !!draftContent.format));
    const timeOk = !!draftContent.time;
    const entryFeeOk = !_.isEmpty(draftContent.entryFee);

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
    const { draftContent } = this.state;
    const { categories } = this.props;

    const selectedCategory = draftContent.category ? categories[draftContent.category] : { formats: [] };
    const formatOptions = _.isEmpty(selectedCategory.formats) ? [] : selectedCategory.formats.split(',');

    const cleanedFormatOptions = {};

    for (const option of formatOptions) {
      const trimmedName = _.trim(option);
      cleanedFormatOptions[trimmedName] = trimmedName;
    }

    return cleanedFormatOptions;
  }

  async saveEvent() {
    const { draftContent, eventId } = this.state;
    const { categories } = this.props;

    const dataToSave = _.cloneDeep(draftContent);
    dataToSave.published = true;

    if (!_.get(categories, `${dataToSave.category}.formats`, false)) {
      dataToSave.format = null;
    }

    await this.setState({ processing: true });
    await firebase.push('/events', dataToSave);
    await firebase.set(`/events/${eventId}`, {});
    this.goBack();
  }

  async goBack() {
    const { history, returnLocation } = this.props;
    await history.push(returnLocation);
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

  render() {
    const { eventId, draftContent, processing } = this.state;

    moment.locale('fi');

    const cleanedFormatOptions = this.cleanFormatOptions();
    const missingFields = this.checkMissingFields();
    const newEvent = eventId.startsWith('DRAFT');

    if (processing) {
      return (
        <div>Processing..</div>
      );
    }
    return (
      <div className="section">
        <h1 className="title">
          {newEvent && <Translate id="newevent" />}
          {!newEvent && <Translate id="editevent" />}
        </h1>
        <EditorForm
          eventId={eventId}
          event={draftContent}
          cleanedFormatOptions={cleanedFormatOptions}
          newEvent={newEvent}
          missingFields={missingFields}
          updateFieldStatus={(key, empty, data) => this.updateFieldStatus(key, empty, data)}
          updateCategory={(key, empty, data) => this.updateFieldStatus(key, empty, data)}
          allowDateEdit={false}
          saveEvent={() => this.saveEvent()}
          deleteEvent={() => this.deleteEvent()}
          goBack={() => this.goBack()}
        />
      </div>
    );

  }
}

NewEventEditor.propTypes = {
  categories: PropTypes.object,
  draftContent: PropTypes.object,
  draftID: PropTypes.string,
  draftDate: PropTypes.object,
  history: PropTypes.object,
  returnLocation: PropTypes.string.isRequired,
};
