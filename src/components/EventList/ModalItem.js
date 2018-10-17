import React, { Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';

export const ModalItem = ({ translationKey, content }) => (
  <Fragment>
    {content &&
    <Fragment>
      <div className="column is-12">
        <div className="subtitle has-text-info"><Translate id={translationKey} /></div>
      </div>

      <div className="column is-1" />
      <div className="column is-11">
        <p>
          {content}
        </p>
      </div>
    </Fragment>
    }
    {!content && <span />}
  </Fragment>
);

ModalItem.propTypes = {
  translationKey: PropTypes.string,
  content: PropTypes.string,
};
