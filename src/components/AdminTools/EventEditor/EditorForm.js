import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';

import _ from 'lodash';
import { Translate } from 'react-localize-redux';

import ValidatedEditableField from './ValidatedEditableField-container';
import ValidatedTimeField from './ValidatedTimeField';
import ValidatedDateField from './ValidatedDateField-container';
import SelectElement from './SelectElement';
import EditableTextarea from './EditableTextarea-container';

import { checkTimeStringFormat } from '../../Common/Utils';

export const EditorForm = ({
  event, eventId, categories, cleanedFormatOptions, newEvent, missingFields,
  updateCategory, updateFieldStatus, allowDateEdit, saveEvent, deleteEvent,
  deleteConfirmation, goBack, storageUrlPath,
}) => (
  <div className="columns is-multiline">
    <div className="column is-hidden-mobile">&nbsp;</div>
    <div className="column is-8 ">
      <div className="columns is-multiline">

        <div className="column is-12">
          <ValidatedEditableField
            isOk={!_.isEmpty(event.name)}
            updateFieldStatus={updateFieldStatus}
            labelContent="name"
            placeHolder="eventnameplaceholder"
            defaultValue={event.name}
            path={`${storageUrlPath}/${eventId}`}
            targetName="name"
            isHorizontal
          />
        </div>

        <div className="column is-hidden-mobile">
          <hr />
        </div>

        <div className="column is-12">
          <SelectElement
            isOk={!_.isEmpty(event.category)}
            updateFieldStatus={updateCategory}
            labelContent="category"
            placeHolder="categoryplaceholder"
            defaultValue={event.category}
            dropdownItems={categories}
            path={`${storageUrlPath}/${eventId}`}
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
                isOk={!_.isEmpty(event.format)}
                updateFieldStatus={updateFieldStatus}
                labelContent="format"
                defaultValue={event.format}
                dropdownItems={cleanedFormatOptions}
                path={`${storageUrlPath}/${eventId}`}
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
          <Translate>
            {translate => (
              <SelectElement
                isOk={!_.isEmpty(event.eventType)}
                updateFieldStatus={updateFieldStatus}
                labelContent="eventtype"
                defaultValue={event.eventType}
                dropdownItems={{ singledayevent: translate('singledayevent'), ongoingevent: translate('ongoingevent') }}
                path={`${storageUrlPath}/${eventId}`}
                targetName="eventType"
                isHorizontal
              />
            )}
          </Translate>
        </div>

        <div className="column is-12">
          <ValidatedDateField
            isOk={!_.isEmpty(event.date)}
            defaultValue={event.date}
            defaultEndValue={event.endDate}
            path={`${storageUrlPath}/${eventId}`}
            targetName="date"
            isHorizontal
            disabled={!allowDateEdit}
            isMulti={event.eventType === 'ongoingevent'}
          />
        </div>

        <div className="column is-12">
          <ValidatedTimeField
            isOk={!_.isEmpty(event.time) && checkTimeStringFormat(event.time)}
            updateFieldStatus={updateFieldStatus}
            labelContent="eventtime"
            targetName="time"
            placeHolder="timeformat"
            defaultValue={event.time}
            path={`${storageUrlPath}/${eventId}`}
          />
        </div>

        <div className="column is-12 is-hidden-mobile">
          <hr />
        </div>

        <div className="column is-12">
          <h2 className="subtitle"><Translate id="eventinfo" /></h2>
        </div>

        <div className="column is-12">
          <ValidatedEditableField
            isOk
            updateFieldStatus={updateFieldStatus}
            labelContent="playerslots"
            placeHolder="playerslotsplaceholder"
            defaultValue={event.playerSlots}
            inputType="number"
            path={`${storageUrlPath}/${eventId}`}
            targetName="playerSlots"
            isHorizontal
          />
        </div>

        <div className="column is-12">
          <ValidatedEditableField
            isOk={!_.isEmpty(event.entryFee)}
            updateFieldStatus={updateFieldStatus}
            labelContent="entryfee"
            placeHolder="entryfeeplaceholder"
            defaultValue={event.entryFee}
            inputType="number"
            path={`${storageUrlPath}/${eventId}`}
            targetName="entryFee"
            isHorizontal
          />
        </div>

        <div className="column is-12">
          <ValidatedEditableField
            isOk
            updateFieldStatus={updateFieldStatus}
            labelContent="ruleslevel"
            placeHolder="ruleslevelplaceholder"
            defaultValue={event.rulesLevel}
            path={`${storageUrlPath}/${eventId}`}
            targetName="rulesLevel"
            isHorizontal
          />
        </div>

        <div className="column is-12">
          <ValidatedEditableField
            isOk
            updateFieldStatus={updateFieldStatus}
            labelContent="link"
            placeHolder="linkplaceholder"
            defaultValue={event.link}
            path={`${storageUrlPath}/${eventId}`}
            targetName="link"
            isHorizontal
          />
        </div>

        <div className="column is-12">
          <EditableTextarea
            isOk
            updateFieldStatus={updateFieldStatus}
            labelContent="prizes"
            placeHolder="prizesplaceholder"
            defaultValue={event.prizes}
            path={`${storageUrlPath}/${eventId}`}
            targetName="prizes"
            isHorizontal
          />
        </div>

        <div className="column is-12">
          <EditableTextarea
            isOk
            updateFieldStatus={updateFieldStatus}
            labelContent="notes"
            placeHolder="notesplaceholder"
            defaultValue={event.notes}
            path={`${storageUrlPath}/${eventId}`}
            targetName="notes"
            isHorizontal
          />
        </div>
        <div className="column is-12">
          {missingFields.length !== 0 &&
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
                        {missingFields.map(field => <span className="tag is-warning has-text-black" key={`missingData-${field}`}>{translate(field)}</span>)}
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

          <button className={`button ${deleteConfirmation ? 'is-danger' : 'is-warning has-text-black'}`} onClick={deleteEvent}>
            {deleteConfirmation && <Translate id="reallydelete" />}
            {!deleteConfirmation && <Translate id="delete" />}
          </button>
          <button className="button is-info is-outlined" onClick={goBack}>
            <Translate id="goback" />
          </button>
          {!newEvent && event.published &&
            <button className="button is-warning is-outlined" onClick={() => firebase.update(`${storageUrlPath}/${eventId}`, { published: false })}><Translate id="hide" /></button>
          }
          {!newEvent && !event.published &&
            <button className="button is-success is-outlined" disabled={missingFields.length !== 0} onClick={() => firebase.update(`${storageUrlPath}/${eventId}`, { published: true })}><Translate id="publish" /></button>
          }

          {newEvent &&
            <button className="button is-success is-outlined" disabled={missingFields.length !== 0} onClick={saveEvent}><Translate id="publish" /></button>
          }
        </div>

      </div>
    </div>
    <div className="column is-hidden-mobile">&nbsp;</div>
  </div>
);


EditorForm.propTypes = {
  categories: PropTypes.object,
  eventId: PropTypes.string,
  event: PropTypes.object,
  missingFields: PropTypes.array,
  cleanedFormatOptions: PropTypes.object,
  newEvent: PropTypes.bool,
  updateFieldStatus: PropTypes.func,
  updateCategory: PropTypes.func,
  allowDateEdit: PropTypes.bool,
  saveEvent: PropTypes.func,
  deleteEvent: PropTypes.func,
  deleteConfirmation: PropTypes.bool,
  goBack: PropTypes.func,
  storageUrlPath: PropTypes.string.isRequired,
};
