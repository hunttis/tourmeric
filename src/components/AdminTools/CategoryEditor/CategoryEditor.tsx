import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import EditableVerticalField from '../../Common/EditableVerticalField-container';
import ImagePicker from '../ImagePicker';

interface State {
  editingCategory: string | null;
}

export default class CategoryEditor extends Component<CategoryEditorProps, State> {

  state: State = { editingCategory: null }

  changeLogo(path: string, value: string) {
    firebase.update(`/${path}`, value);
  }

  deleteCategory(categoryId: string) {
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
            <div className="column is-6">

              {Object.entries(categories).map(([categoryId, categoryData]) => {
                const boxClasses = 'message';
                const categoryLogo = uploadedCategoryLogos && categoryData.logo ? uploadedCategoryLogos[categoryData.logo] : '';
                const categoryImageSmall = uploadedCategoryLogos && categoryData.imageSmall ? uploadedCategoryLogos[categoryData.imageSmall] : '';
                const allowedToDelete = !_.find(events, { category: categoryId });

                return (
                  <div className={boxClasses} key={`categoryeditor-${categoryId}`}>
                    <div className="message-header">
                      <span className="icon">
                        {categoryLogo && <img className="image is-32x32" src={categoryLogo.downloadURL} alt="" />}
                        {!categoryLogo && <Translate id="nologo" />}
                      </span>
                      <span>
                        {categoryImageSmall && <img className="image is-32x32" src={categoryImageSmall.downloadURL} alt="" />}
                        {!categoryImageSmall && <Translate id="nosmallimage" />}
                      </span>
                      <span>
                        {categoryData.name}
                      </span>
                      {!allowedToDelete && <button disabled className="button is-small is-info"><Translate id="cannotdeleteinuse" /></button>}
                      {allowedToDelete && <button className="button is-small is-danger" onClick={() => this.deleteCategory(categoryId)}><Translate id="delete" /></button>}
                      {this.state.editingCategory === categoryId && <button className="button is-small is-success" onClick={() => this.setState({ editingCategory: null })}><Translate id="editing" /></button>}
                      {this.state.editingCategory !== categoryId && <button className="button is-small is-info" onClick={() => this.setState({ editingCategory: categoryId })}><Translate id="edit" /></button>}
                    </div>
                  </div>
                );
              })
            }
            </div>
            <div className="column is-6">
              {this.state.editingCategory &&
                <CategoryEditorPanel categoryId={this.state.editingCategory} categoryData={categories[this.state.editingCategory]} uploadedCategoryLogos={uploadedCategoryLogos} />
              }
            </div>
          </div>
        </div>
      );
    }

    if (!isLoaded(categories)) {
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

interface CategoryEditorPanelProps {
  categoryId: string;
  categoryData: Category;
  uploadedCategoryLogos: {[key: string]: CategoryLogo};
}

const CategoryEditorPanel = ({ categoryId, categoryData, uploadedCategoryLogos }: CategoryEditorPanelProps) => (
  <div className="message-body">
    <EditableVerticalField
      labelContent="name"
      placeHolder="nameofthegame"
      defaultValue={categoryData.name}
      path={`/categories/${categoryId}`}
      targetName="name"
    />
    <EditableVerticalField
      labelContent="abbreviation"
      placeHolder="abbreviationofthename"
      defaultValue={categoryData.abbreviation}
      path={`/categories/${categoryId}`}
      targetName="abbreviation"
    />
    <EditableVerticalField
      labelContent="type"
      placeHolder="gametype"
      defaultValue={categoryData.type}
      path={`/categories/${categoryId}`}
      targetName="type"
    />
    <EditableVerticalField
      labelContent="formats"
      placeHolder="formatsplaceholder"
      defaultValue={categoryData.formats}
      path={`/categories/${categoryId}`}
      targetName="formats"
    />

    <br />
    <ImagePicker
      imageList={uploadedCategoryLogos}
      highlightedImage={categoryData.image}
      path={`/categories/${categoryId}`}
      size="is-32x32"
    />

  </div>
);

const FileSelector = ({ path, files, defaultValue, onChange }) => (
  <div>
    <label className="label">
      <Translate id="categorylogo" />
    </label>
    <div className="control">
      <div className="select">
        <select defaultValue={defaultValue} onChange={event => onChange(path, { logo: event.target.value })}>
          <option value=""><Translate id="select" /></option>
          {files && Object.keys(files).map(fileKey => <option key={fileKey} value={fileKey}>{files[fileKey].name}</option>)}
        </select>
      </div>
    </div>
  </div>
);

interface CategoryEditorProps {
  categories: {[key: string]: Category};
  uploadedCategoryLogos: {[key: string]: CategoryLogo};
  events: {[key: string]: {category: string | null}};
}

interface Category {
  abbreviation: string;
  formats: string;
  image: string;
  imageSmall: string | null;
  logo: string;
  name: string;
  type: string;
}

interface CategoryLogo {
  downloadURL: string;
  name: string;
}

FileSelector.propTypes = {
  path: PropTypes.string,
  files: PropTypes.object,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
};
