import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { isLoaded } from 'react-redux-firebase';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';

import { mapCategoryToColor } from '../../Common/Utils';

export const CreditAmounts = ({ userId, storecredit, storecreditcategories }) => (
  <Fragment>
    {/* <div>FFuuuu {userId}</div> */}
    {isLoaded(storecreditcategories) &&
      <Fragment>
        {Object.entries(storecreditcategories).map((categoryEntry) => {
          const categoryKey = categoryEntry[0];
          const categoryValue = categoryEntry[1];
          const userData = storecredit[userId];
          const dataForCategory = _.filter(userData, (data) => {
            if (categoryKey === 'white') {
              return data.category === categoryKey || !data.category || data.category === '';
            }
            return data.category === categoryKey;
          });
          const categorySum = _.reduce(dataForCategory, (totalForCategory, data) => totalForCategory + parseFloat(data.value), 0);
          return (
            <li key={`${userId}-${categoryKey}`}><span className={`has-text-${mapCategoryToColor(categoryKey)}`}>{categoryValue}</span> : {categorySum.toFixed(2)} €</li>
          );
        })}
        <li>&nbsp;</li>
        <li className="is-all-caps">
          <strong><Translate id="total" />: {_.reduce(storecredit[userId], (totalForUser, data) => totalForUser + parseFloat(data.value), 0)} €</strong>
        </li>
      </Fragment>
    }
  </Fragment>
);

CreditAmounts.propTypes = {
  userId: PropTypes.string.isRequired,
  storecredit: PropTypes.object.isRequired,
  storecreditcategories: PropTypes.object.isRequired,
};
