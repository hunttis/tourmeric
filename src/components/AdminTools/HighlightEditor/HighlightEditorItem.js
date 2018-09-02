import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';

export const HighlightEditorItem = ({ highlightEntry, openModal }) => {
  const highlightId = highlightEntry[0];
  const highlight = highlightEntry[1];
  const highlightImageExists = Boolean(highlight.image);
  return (
    <Fragment>
      <div key={highlightId} className="columns is-tablet card">
        <div className="column is-3">{moment(highlight.createDate).format('DD-MM-YYYY')}</div>
        <div className="column is-4">{highlight.name || 'No name'}</div>
        <div className="column is-2">
          {highlightImageExists &&
          <figure className="image is-3by1">
            <img alt="" src={highlight.image} />
          </figure>
                }
          {!highlightImageExists && 'No image'}
        </div>

        <div className="column is-1">
          <button className="button" onClick={() => openModal(highlightId, highlight)}><Translate id="edit" /></button>
        </div>
        <div className="column is-1">
          <button className="button is-danger" onClick={() => deleteHighlight(highlightId)}><Translate id="delete" /></button>
        </div>
        <div className="column is-1">
          {highlight.active &&
          <button className="button is-warning" onClick={() => setActiveStatus(highlightId, false)}><Translate id="deactivate" /></button>
              }
          {!highlight.active &&
          <button className="button is-success" onClick={() => setActiveStatus(highlightId, true)}><Translate id="activate" /></button>
              }
        </div>
      </div>
    </Fragment>
  );
};

const deleteHighlight = (highlightId) => {
  firebase.set(`/highlights/${highlightId}`, {});
};

const setActiveStatus = (highlightId, newStatus) => {
  firebase.update(`/highlights/${highlightId}`, { active: newStatus });
};


HighlightEditorItem.propTypes = {
  highlightEntry: PropTypes.array.isRequired,
  openModal: PropTypes.func.isRequired,
};
