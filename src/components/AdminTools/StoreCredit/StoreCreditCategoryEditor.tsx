import React, { Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';
import _ from 'lodash';
import EditableVerticalField from '../../Common/EditableVerticalField-container';
import { StoreCreditCategory } from '~/models/ReduxState';

interface Props {
  storecreditcategories: {[key: string]: StoreCreditCategory},
};

export const StoreCreditCategoryEditor = ({ storecreditcategories }: Props) => (
  <section>
    <h1 className="title"><Translate id="storecreditcategories" /></h1>
    {(!storecreditcategories || !isLoaded(storecreditcategories)) && <div><Translate id="loading" /></div>}
    {(isLoaded(storecreditcategories)) &&
    <Fragment>
      <h2 className="subtitle"><Translate id="ifyouwanttouseacategorygiveitaname" /></h2>
      <h2 className="subtitle"><Translate id="namelesscategoriesarehidden" /></h2>
      <div className="columns is-multiline">
        <div className="column is-6">
          <EditableVerticalField
            labelContent="whitecategoryname"
            placeHolder="white"
            defaultValue={_.get(storecreditcategories, 'white')}
            path="/storecreditcategories"
            targetName="white"
            emptyClass="is-danger"
          />
        </div>
        <div className="column is-6">
          <EditableVerticalField
            labelContent="greencategoryname"
            placeHolder="green"
            defaultValue={_.get(storecreditcategories, 'green')}
            path="/storecreditcategories"
            targetName="green"
            emptyClass="is-danger"
          />
        </div>
        <div className="column is-6">
          <EditableVerticalField
            labelContent="redcategoryname"
            placeHolder="red"
            defaultValue={_.get(storecreditcategories, 'red')}
            path="/storecreditcategories"
            targetName="red"
            emptyClass="is-danger"
          />
        </div>
        <div className="column is-6">
          <EditableVerticalField
            labelContent="yellowcategoryname"
            placeHolder="yellow"
            defaultValue={_.get(storecreditcategories, 'yellow')}
            path="/storecreditcategories"
            targetName="yellow"
            emptyClass="is-danger"
          />
        </div>
        <div className="column is-6">
          <EditableVerticalField
            labelContent="bluecategoryname"
            placeHolder="blue"
            defaultValue={_.get(storecreditcategories, 'blue')}
            path="/storecreditcategories"
            targetName="blue"
            emptyClass="is-danger"
          />
        </div>
      </div>
    </Fragment>
    }

  </section>
);
