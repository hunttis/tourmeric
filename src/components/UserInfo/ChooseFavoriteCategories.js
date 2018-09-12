import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import _ from 'lodash';

export default class ChooseFavoriteCategories extends Component {

  async toggleCategory(categoryId) {
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
                {category.name}
              </button>
            </div>

          );
        })}
      </Fragment>
    );
  }
}

ChooseFavoriteCategories.propTypes = {
  categories: PropTypes.object,
  profile: PropTypes.object,
  auth: PropTypes.object,
};
