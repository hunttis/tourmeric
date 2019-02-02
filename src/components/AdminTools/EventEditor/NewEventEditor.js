import React, { Component, Fragment } from 'react';
import firebase from 'firebase/app';

import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { Translate } from 'react-localize-redux';

import ValidatedEditableField from './ValidatedEditableField-container';
import ValidatedTimeField from './ValidatedTimeField';
import ValidatedDateField from './ValidatedDateField-container';
import SelectElement from './SelectElement';

import EditableTextarea from './EditableTextarea-container';

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

    this.updateFieldStatus.bind(this);
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
    const categoryOk = !!draftContent.category &&
      (cleanFormatOptionsLength === 0 || (cleanFormatOptionsLength > 0 && !!draftContent.format));
    const timeOk = !!draftContent.time;
    const entryFeeOk = !_.isEmpty(draftContent.entryFee);

    const missingFields = [];
    if (!nameOk) {
      missingFields.push('name');
    }
    if (!categoryOk) {
      missingFields.push('category');
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
    const { history, categories } = this.props;

    const fromLocation = _.replace(eventId.substr(6), /-/g, '/');
    const dataToSave = _.cloneDeep(draftContent);
    dataToSave.published = true;

    if (!_.get(categories, `${dataToSave.category}.formats`, false)) {
      dataToSave.format = null;
    }

    await this.setState({ processing: true });
    await firebase.push('/events', dataToSave);
    await firebase.set(`/events/${eventId}`, {});
    await history.push(`/events/${fromLocation}`);
  }

  async deleteEvent() {
    const { eventId } = this.state;
    const { history } = this.props;
    const fromLocation = _.replace(eventId.substr(6), /-/g, '/');

    await this.setState({ processing: true });
    await firebase.set(`/events/${eventId}`, {});
    await history.push(`/events/${fromLocation}`);
  }

  render() {
    const { eventId, draftContent, processing } = this.state;
    const { categories } = this.props;

    moment.locale('fi');

    const cleanedFormatOptions = this.cleanFormatOptions();

    if (processing) {
      return (
        <div>Processing..</div>
      );
    }
    return (
      <div className="section">
        <div className="columns is-multiline">
          <div className="column is-12">
            <h1 className="title"><Translate id="newevent" /></h1>
          </div>
          <div className="column is-hidden-mobile">&nbsp;</div>
          <div className="column is-8 ">
            <div className="columns is-multiline">

              <div className="column is-12">
                <ValidatedEditableField
                  isOk={!!draftContent.name}
                  updateFieldStatus={(key, empty, data) => this.updateFieldStatus(key, empty, data)}
                  labelContent="name"
                  placeHolder="eventnameplaceholder"
                  defaultValue={draftContent.name}
                  path={`/events/${eventId}`}
                  targetName="name"
                  isHorizontal
                />
              </div>

              <div className="column is-hidden-mobile">
                <hr />
              </div>

              <div className="column is-12">
                <SelectElement
                  isOk={!!draftContent.category}
                  updateFieldStatus={(key, empty, data) => this.updateFieldStatus(key, empty, data)}
                  labelContent="category"
                  placeHolder="categoryplaceholder"
                  defaultValue={draftContent.category}
                  dropdownItems={categories}
                  path={`/events/${eventId}`}
                  targetName="category"
                  nameProp="abbreviation"
                  isHorizontal
                />
              </div>

              <div className="column is-12 is-hidden-mobile">
                <hr />
              </div>

              {!_.isEmpty(cleanedFormatOptions) &&
                <Fragment>

                  <div className="column is-12">
                    <SelectElement
                      isOk={!!draftContent.format}
                      updateFieldStatus={(key, empty, data) => this.updateFieldStatus(key, empty, data)}
                      labelContent="format"
                      placeHolder="formatplaceholder"
                      defaultValue={draftContent.format}
                      dropdownItems={cleanedFormatOptions}
                      path={`/events/${eventId}`}
                      targetName="format"
                      isHorizontal
                    />
                  </div>
                  <div className="column is-12 is-hidden-mobile">
                    <hr />
                  </div>

                </Fragment>
              }

              <div className="column is-12">
                <ValidatedDateField
                  defaultValue={draftContent.date}
                  path={`/events/${eventId}`}
                  targetName="date"
                  isHorizontal
                  disabled
                />
              </div>

              <div className="column is-12">
                <ValidatedTimeField
                  isOk={!!draftContent.time}
                  updateFieldStatus={(key, empty, data) => this.updateFieldStatus(key, empty, data)}
                  labelContent="eventtime"
                  placeHolder="timeformat"
                  defaultValue={draftContent.time}
                  path={`/events/${eventId}`}
                />
              </div>

              <div className="column is-12">
                <h2 className="subtitle"><Translate id="eventinfo" /></h2>
              </div>

              <div className="column is-12">
                <ValidatedEditableField
                  isOk
                  updateFieldStatus={(key, empty, data) => this.updateFieldStatus(key, empty, data)}
                  labelContent="playerslots"
                  placeHolder="playerslotsplaceholder"
                  defaultValue={draftContent.playerSlots}
                  inputType="number"
                  path={`/events/${eventId}`}
                  targetName="playerSlots"
                  isHorizontal
                />
              </div>

              <div className="column is-12">
                <ValidatedEditableField
                  isOk={!!draftContent.entryFee}
                  updateFieldStatus={(key, empty, data) => this.updateFieldStatus(key, empty, data)}
                  labelContent="entryfee"
                  placeHolder="entryfeeplaceholder"
                  defaultValue={draftContent.entryFee}
                  inputType="number"
                  path={`/events/${eventId}`}
                  targetName="entryFee"
                  isHorizontal
                />
              </div>

              <div className="column is-12">
                <ValidatedEditableField
                  isOk
                  updateFieldStatus={(key, empty, data) => this.updateFieldStatus(key, empty, data)}
                  labelContent="ruleslevel"
                  placeHolder="ruleslevelplaceholder"
                  defaultValue={draftContent.rulesLevel}
                  path={`/events/${eventId}`}
                  targetName="rulesLevel"
                  isHorizontal
                />
              </div>

              <div className="column is-12">
                <ValidatedEditableField
                  isOk
                  updateFieldStatus={(key, empty, data) => this.updateFieldStatus(key, empty, data)}
                  labelContent="link"
                  placeHolder="linkplaceholder"
                  defaultValue={draftContent.link}
                  path={`/events/${eventId}`}
                  targetName="link"
                  isHorizontal
                />
              </div>

              <div className="column is-12">
                <EditableTextarea
                  isOk
                  updateFieldStatus={(key, empty, data) => this.updateFieldStatus(key, empty, data)}
                  labelContent="prizes"
                  placeHolder="prizesplaceholder"
                  defaultValue={draftContent.prizes}
                  path={`/events/${eventId}`}
                  targetName="prizes"
                  isHorizontal
                />
              </div>

              <div className="column is-12">
                <EditableTextarea
                  isOk
                  updateFieldStatus={(key, empty, data) => this.updateFieldStatus(key, empty, data)}
                  labelContent="notes"
                  placeHolder="notesplaceholder"
                  defaultValue={draftContent.notes}
                  path={`/events/${eventId}`}
                  targetName="notes"
                  isHorizontal
                />
              </div>
              <div className="column is-12">
                {this.checkMissingFields().length !== 0 &&
                  <Translate>
                    {translate => (
                      <div className="field is-horizontal">

                        <div className="field-label is-normal">
                          <label className="label">{translate('youstillneedtoadd')}</label>
                        </div>

                        <div className="field-body">
                          <div className="field">
                            <div className="control">
                              <span className="tags are-medium">
                                {this.checkMissingFields().map(field => <span className="tag is-warning has-text-black" key={`missingData-${field}`}>{translate(field)}</span>)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Translate>
                }
              </div>
              <div className="column has-text-right">
                <button className="button is-danger" onClick={() => this.deleteEvent()}><Translate id="delete" /></button>
                <button className="button is-success is-outlined" disabled={this.checkMissingFields().length !== 0} onClick={() => this.saveEvent()}><Translate id="publish" /></button>
              </div>
            </div>
          </div>
          <div className="column is-hidden-mobile">&nbsp;</div>
        </div>
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
};
