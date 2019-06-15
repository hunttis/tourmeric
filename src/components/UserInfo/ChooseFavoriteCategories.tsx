import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';
import _ from 'lodash';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { Category } from '~/models/Category';
import { FirebaseProfile, FirebaseAuth } from '~/models/ReduxState';

interface Props {
  categories: { [key: string]: Category };
  profile: FirebaseProfile;
  auth: FirebaseAuth;
}

export default class ChooseFavoriteCategories extends Component<Props> {

  async toggleCategory(categoryId: string) {
    const { profile } = this.props;
    const chosenCategories = profile.favoriteCategories || '';
    let modifiedCategories;
    if (chosenCategories.indexOf(categoryId) === -1) {
      modifiedCategories = `${chosenCategories} ${categoryId}`;
    } else {
      modifiedCategories = _.replace(chosenCategories, categoryId, '');
    }
    modifiedCategories = _.replace(modifiedCategories, '  ', ' ');
    await firebase.update(`/users/${this.props.auth.uid}`, { favoriteCategories: modifiedCategories });
  }

  render() {
    const { categories, profile } = this.props;
    const chosenCategories = profile.favoriteCategories || '';

    if (isLoaded(categories) && isEmpty(categories)) {
      return <div />;
    }

    return (
      <Fragment>
        <h2 className="subtitle">
          <Translate id="chooseyourfavorites" />
        </h2>
        <div className="content">
          <p><Translate id="thesewillbeinyourtodayviewanddefaultfilterforevents" /></p>
          <p><Translate id="choosingnonewillfilternothing" /></p>
        </div>
        {Object.entries(categories).map((categoryEntry) => {
          const categoryId = categoryEntry[0];
          const category = categoryEntry[1];
          const categoryChosen = chosenCategories.indexOf(categoryId) !== -1;

          return (
            <div key={`categorytoggle-${category.name}`} className="field">
              <button onClick={() => this.toggleCategory(categoryId)} className={`button ${categoryChosen ? 'is-success' : 'is-outlined'}`}>
                <figure className="image is-16x16">
                  <img alt="" src={category.image} />
                </figure>
                &nbsp;&nbsp;{category.name}
              </button>
            </div>

          );
        })}
      </Fragment>
    );
  }
}
