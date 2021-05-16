import React from 'react';
import moment from 'moment';
import { FormattedMessage } from "react-intl";
import firebase from 'firebase/app';
import { HighLight } from '../../../models/ReduxState';

interface Props {
  highlightEntry: [string, HighLight];
  openModal: (key: string, value: HighLight) => void;
}

export const HighlightEditorItem = ({ highlightEntry, openModal }: Props) => {
  const highlightId = highlightEntry[0];
  const highlight = highlightEntry[1];
  const highlightImageExists = Boolean(highlight.image);
  return (
    <>
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
          <button className="button" onClick={() => openModal(highlightId, highlight)}><FormattedMessage id="edit" /></button>
        </div>
        <div className="column is-1">
          <button className="button is-danger" onClick={() => deleteHighlight(highlightId)}><FormattedMessage id="delete" /></button>
        </div>
        <div className="column is-1">
          {highlight.active &&
            <button className="button is-warning" onClick={() => setActiveStatus(highlightId, false)}><FormattedMessage id="deactivate" /></button>
          }
          {!highlight.active &&
            <button className="button is-success" onClick={() => setActiveStatus(highlightId, true)}><FormattedMessage id="activate" /></button>
          }
        </div>
      </div>
    </>
  );
};

const deleteHighlight = (highlightId: string) => {
  firebase.set(`/highlights/${highlightId}`, {});
};

const setActiveStatus = (highlightId: string, newStatus: boolean) => {
  firebase.update(`/highlights/${highlightId}`, { active: newStatus });
};
