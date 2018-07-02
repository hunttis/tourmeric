import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import EditableVerticalField from '../../Common/EditableVerticalField-container';

export default class CategoryEditor extends Component {

  changeLogo(path, value) {
    firebase.update(`/${path}`, value);
  }

  deleteCategory(categoryId) {
    firebase.set(`/categories/${categoryId}`, {});
  }

  render() {
    const { categories, uploadedCategoryLogos, events } = this.props;

    if (isLoaded(categories) && !isEmpty(categories) && isLoaded(uploadedCategoryLogos)) {
      return (
        <div>
          <div className="field">
            <button className="button" onClick={() => firebase.push('/categories/', { name: 'New' })}>
              <Translate id="addcategory" />
            </button>
          </div>
          <div className="columns is-multiline">
            {Object.entries(categories).map((categoryEntry) => {
              const categoryId = categoryEntry[0];
              const category = categoryEntry[1];
              const boxClasses = 'message';
              const categoryLogo = uploadedCategoryLogos[category.logo];
              const allowedToDelete = !_.find(events, { category: categoryId });

              return (
                <div className="column is-half" key={`categoryeditor-${categoryId}`}>
                  <div className={boxClasses}>
                    <div className="message-header">
                      {categoryLogo &&
                        <img className="image is-32x32" src={categoryLogo.downloadURL} alt="" />
                      }
                      {category.name}
                      {!allowedToDelete && <button disabled className="button is-small is-info"><Translate id="cannotdeleteinuse" /></button>}
                      {allowedToDelete && <button className="button is-small is-danger" onClick={() => this.deleteCategory(categoryId)}><Translate id="delete" /></button>}
                    </div>
                    <div className="message-body">
                      <EditableVerticalField
                        labelContent="name"
                        placeHolder="Name of the game"
                        defaultValue={category.name}
                        path={`/categories/${categoryId}`}
                        targetName="name"
                      />
                      <EditableVerticalField
                        labelContent="abbreviation"
                        placeHolder="Abbreviation of the name, preferably 10 characters or less"
                        defaultValue={category.abbreviation}
                        path={`/categories/${categoryId}`}
                        targetName="abbreviation"
                      />
                      <EditableVerticalField
                        labelContent="type"
                        placeHolder="Game type (card, board, miniature etc.)"
                        defaultValue={category.type}
                        path={`/categories/${categoryId}`}
                        targetName="type"
                      />
                      <FileSelector
                        files={uploadedCategoryLogos}
                        defaultValue={category.logo}
                        onChange={this.changeLogo}
                        path={`/categories/${categoryId}`}
                        targetName="logo"
                      />

                    </div>
                  </div>
                </div>);
            })}
          </div>
        </div>
      );
    } else if (!isLoaded(categories)) {
      return <div><Translate id="loading" /></div>;
    }

    return (
      <div>
        <div><Translate id="nocategories" /></div>
        <div className="field"><button className="button is-primary" onClick={() => firebase.push('/categories/', { name: 'New' })}><Translate id="addcategory" /></button></div>
      </div>
    );
  }
}

const FileSelector = ({ path, files, defaultValue, onChange }) => (
  <div>
    <label className="label">
      <Translate id="categorylogo" />
    </label>
    <div className="control">
      <div className="select">
        <select defaultValue={defaultValue} onChange={event => onChange(path, { logo: event.target.value })}>
          <option value=""><Translate id="select" /></option>
          {Object.keys(files).map(fileKey => <option key={fileKey} value={fileKey}>{files[fileKey].name}</option>)}
        </select>
      </div>
    </div>
  </div>
);

CategoryEditor.propTypes = {
  categories: PropTypes.object,
  uploadedCategoryLogos: PropTypes.object,
  events: PropTypes.object,
};

FileSelector.propTypes = {
  path: PropTypes.string,
  files: PropTypes.object,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
};
