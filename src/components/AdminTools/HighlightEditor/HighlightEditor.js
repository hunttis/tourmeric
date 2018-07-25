import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import moment from 'moment';

import EditableField from '../../Common/EditableField-container';

export default class HighlightEditor extends Component {

  constructor(props) {
    super(props);
    this.state = { modalOpenClass: '' };
  }

  setActiveStatus(highlightId, newStatus) {
    firebase.update(`/highlights/${highlightId}`, { active: newStatus });
    this.setState({ highlightActive: newStatus });
  }

  createNewHighlight() {
    firebase.push('/highlights', { createDate: moment().toISOString(), date: moment().format('YYYY-MM-DD') });
  }

  listHighlights(highlights) {
    return (
      <Fragment>
        {Object.entries(highlights).map((highlightEntry) => {
          const highlightId = highlightEntry[0];
          const highlight = highlightEntry[1];
          const highlightImageExists = Boolean(highlight.image);
          return (
            <div key={highlightId} className="columns is-tablet">
              <div className="column is-3">{moment(highlight.createDate).format('DD-MM-YYYY')}</div>
              {/* <div className="column is-3">{moment(highlight.date).format('DD-MM-YYYY')}</div> */}
              <div className="column is-3">{highlight.name || 'No name'}</div>
              <div className="column is-3">
                {highlightImageExists && <img alt="" src={highlight.image} /> }
                {!highlightImageExists && 'No image'}
              </div>

              <div className="column is-3">
                <button className="button" onClick={() => this.openModal(highlightId, highlight)}>Edit highlight</button>
              </div>
            </div>
          );
        })}
      </Fragment>
    );
  }

  openModal(highlightId, highlight) {
    this.setState({ modalOpenClass: 'is-active', highlightId, highlightName: highlight.name, highlightImage: highlight.image, highlightDate: highlight.date, highlightActive: highlight.active });

    console.log('Open modal?');
  }

  closeModal() {
    this.setState({ modalOpenClass: '', highlightId: '', highlightName: '', highlightDate: '', highlightImage: '', highlightActive: '' });
  }

  highlightModal(modalOpenClass, highlightId, highlightName, highlightImage, highlightDate, highlightActive) {
    return (
      <div className={`modal ${modalOpenClass}`}>
        <div className="modal-background" onClick={() => this.closeModal()} />
        <div className="modal-content">
          <div className="box">

            <EditableField
              defaultValue={highlightName}
              labelContent="name"
              placeHolder="name"
              path={`/highlights/${highlightId}`}
              targetName="name"
            />
            <EditableField
              defaultValue={highlightDate}
              labelContent="date"
              placeHolder="date"
              path={`/highlights/${highlightId}`}
              targetName="date"
            />
            <EditableField
              defaultValue={highlightImage}
              labelContent="image"
              placeHolder="image"
              path={`/highlights/${highlightId}`}
              targetName="image"
            />

            {highlightActive &&
              <button className="button is-danger" onClick={() => this.setActiveStatus(highlightId, false)} >Deactivate</button>
            }
            {!highlightActive &&
              <button className="button is-success" onClick={() => this.setActiveStatus(highlightId, true)} >Activate</button>
            }

            <div>ID: {highlightId}</div>
          </div>

        </div>
        <button className="modal-close is-large" aria-label="close" onClick={() => this.closeModal()} />
      </div>
    );
  }

  render() {
    const { highlights } = this.props;
    const { modalOpenClass, highlightId, highlightName, highlightImage, highlightDate, highlightActive } = this.state;

    if (isLoaded(highlights)) {
      console.log('modal open? ', modalOpenClass);
      return (
        <Fragment>
          <button className="button" onClick={() => this.createNewHighlight()}>New highlight</button>
          {this.highlightModal(modalOpenClass, highlightId, highlightName, highlightImage, highlightDate, highlightActive)}
          {!isEmpty(highlights) && this.listHighlights(highlights)}
          {isEmpty(highlights) && <div>No highlights created, yet...</div>}
        </Fragment>
      );

    }
    return <div><Translate id="loading" /></div>;
  }
}

HighlightEditor.propTypes = {
  highlights: PropTypes.object,
};
