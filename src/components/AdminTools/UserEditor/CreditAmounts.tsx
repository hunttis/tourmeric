import React from 'react';
import { isLoaded } from 'react-redux-firebase';
import _ from 'lodash';
import { FormattedMessage, IntlShape } from "react-intl";

import { mapCategoryToColor } from '../../Common/Utils';

interface CreditAmountsProps {
  userId: string;
  storecredit: { [key: string]: { [key: string]: StoreCredit } };
  storecreditcategories: { [key: string]: string };
}

interface StoreCredit {
  category: string;
  value: number;
}

export const CreditAmounts = ({ userId, storecredit, storecreditcategories }: CreditAmountsProps) => (
  <>
    {isLoaded(storecreditcategories) &&
      <>
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
          const categorySum = _.reduce(dataForCategory, (totalForCategory, data) => totalForCategory + data.value, 0.0).toFixed(2);
          return (
            <li key={`${userId}-${categoryKey}`}><span className={`has-text-${mapCategoryToColor(categoryKey)}`}>{categoryValue}</span> : {categorySum} €</li>
          );
        })}
        <li>&nbsp;</li>
        <li className="is-all-caps">
          <strong><FormattedMessage id="total" />: {_.reduce(storecredit[userId], (totalForUser, data) => totalForUser + data.value, 0).toFixed(2)} €</strong>
        </li>
      </>
    }
    {!isLoaded(storecreditcategories) &&
      <div>Loading</div>
    }
  </>
);
