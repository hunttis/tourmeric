import React, { Component } from 'react';
import firebase from 'firebase/app';
import _ from 'lodash';
import moment from 'moment';
import { FormattedMessage } from "react-intl";
import { isLoaded } from 'react-redux-firebase';

import { History } from 'history';
import EditorForm from './EditorForm-container';
import { Category } from '../../../models/Category';
import { TourmericEvent } from '../../../models/Events';

interface Props {
  categories: {[key: string]: Category};
  eventId: string;
  history: History;
  event: TourmericEvent;
  returnLocation: string;
  isOngoingEvent: boolean;
}

interface State {
  processing: boolean;
  deleteConfirmation: boolean;
  storageUrlPath: string;
}

export default class ExistingEventEditor extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    const storageUrlPath = props.isOngoingEvent ? '/eventsongoing' : '/events';
    this.state = { processing: false, deleteConfirmation: false, storageUrlPath };

    window.scrollTo(0, 0);

    if (props.eventId.startsWith('DRAFT') && !props.event) {
      const date = props.eventId.substr(6);
      firebase.update(`${storageUrlPath}/${props.eventId}`, { createDate: moment().toISOString(), date });
    } else if (!props.event && !props.isOngoingEvent) {
      firebase.update(`${storageUrlPath}/${props.eventId}`, { editDate: moment().toISOString() });
    } else {
      firebase.update(`${storageUrlPath}/${props.eventId}`, { editDate: moment().toISOString() });
    }

    if (props.event && !props.event.eventType) {
      firebase.update(`${storageUrlPath}/${props.eventId}`, { eventType: 'singledayevent' });
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState)) {
      return false;
    }
    return true;
  }

  updateCategory(key: string, empty: boolean, data: string) {
    const { categories, eventId } = this.props;

    const selectedCategory = data ? categories[data] : { formats: [] };
    if (_.isEmpty(selectedCategory.formats)) {
      firebase.update(`${this.state.storageUrlPath}/${eventId}`, { format: null });
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
    const timeOk = !!event.time;
    const dateOk = event.eventType === 'ongoingevent' ? !!event.endDate : true;

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
    if (!dateOk) {
      missingFields.push('enddate');
    }

    return missingFields;
  }

  cleanFormatOptions() {
    const { categories, event } = this.props;

    if (!isLoaded(event)) {
      return {};
    }

    const selectedCategory = event.category ? categories[event.category] : { formats: null };
    const formatOptions = _.isEmpty(selectedCategory.formats) || !selectedCategory.formats ? [] : selectedCategory.formats.split(',');

    const cleanedFormatOptions: {[key: string]: string} = {};

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
    await firebase.set(`${this.state.storageUrlPath}/${eventId}`, {});
    this.goBack();
  }

  async hideEvent() {
    const { eventId } = this.props;
    await firebase.update(`${this.state.storageUrlPath}/${eventId}`, { published: false });
  }

  async publishEvent() {
    const { eventId } = this.props;
    await firebase.update(`${this.state.storageUrlPath}/${eventId}`, { published: true });
  }

  async goBack() {
    const { history, returnLocation } = this.props;
    await history.push(returnLocation);
  }

  render() {
    const { processing, deleteConfirmation, storageUrlPath } = this.state;
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

    if (!storageUrlPath) {
      return <div>ERROR IN STORAGE URL PATH</div>;
    }

    const cleanedFormatOptions = this.cleanFormatOptions();
    const missingFields = this.checkMissingFields();
    const newEvent = eventId.startsWith('DRAFT') || eventId.startsWith('NEW');
    const allowDateEdit = !eventId.startsWith('DRAFT');

    return (
      <div className="section">
        <h1 className="title">
          {newEvent && <FormattedMessage id="newevent" />}
          {!newEvent && <FormattedMessage id="editevent" />}
        </h1>
        <EditorForm
          eventId={eventId}
          event={event || {}}
          cleanedFormatOptions={cleanedFormatOptions}
          newEvent={newEvent}
          missingFields={missingFields}
          updateFieldStatus={() => {}}
          updateCategory={(key: string, empty: boolean, data: string) => this.updateCategory(key, empty, data)}
          allowDateEdit={allowDateEdit}
          saveEvent={() => this.saveEvent()}
          deleteEvent={() => this.deleteEvent()}
          deleteConfirmation={deleteConfirmation}
          goBack={() => this.goBack()}
          storageUrlPath={storageUrlPath}
        />
      </div>
    );

  }
}
