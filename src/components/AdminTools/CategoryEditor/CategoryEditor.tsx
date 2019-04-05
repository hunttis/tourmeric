import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import EditableVerticalField from '../../Common/EditableVerticalField-container';
import ImagePicker from '../ImagePicker';

interface State {
  editingCategory?: string | null;
  pickingImage: boolean;
  pickingSmallImage: boolean;
}

export default class CategoryEditor extends Component<CategoryEditorProps, State> {

  state: State = { editingCategory: null, pickingImage: false, pickingSmallImage: false }

  addCategory = async () => {
    const result = await firebase.push('/categories/', { name: 'NEW CATEGORY' });
    this.setState({ editingCategory: result.key });
  }

  deleteCategory(categoryId: string) {
    firebase.set(`/categories/${categoryId}`, {});
  }

  changeEditedCategory = (categoryId: string | null) => {
    this.setState({ editingCategory: null, pickingImage: false, pickingSmallImage: false }, () => {
      if (categoryId !== null) {
        this.setState({ editingCategory: categoryId });
      }
    });
  }

  changeLogo(path: string, value: string) {
    firebase.update(`/${path}`, value);
  }

  render() {
    const { categories, uploadedCategoryLogos, events } = this.props;
    const { editingCategory, pickingImage, pickingSmallImage } = this.state;


    if (isLoaded(categories) && isLoaded(uploadedCategoryLogos)) {
      console.log('updating render!', editingCategory && categories[editingCategory]);
      return (
        <div className="section">

          <div className="field">
            <button className="button" onClick={this.addCategory}>
              <Translate id="addcategory" />
            </button>
          </div>

          <div className="columns is-multiline">
            <div className="column is-6">

              <table className="table is-fullwidth">
                <thead>
                  <tr>
                    <th>
                      <Translate id="image" />
                      <br />
                      <span className="has-text-info" />
                    </th>
                    <th>
                      <Translate id="smallimage" />
                      <br />
                      <span className="has-text-info" />
                    </th>
                    <th><Translate id="name" /></th>
                    <th><Translate id="actions" /></th>
                  </tr>
                </thead>
                <tbody>

                  {!isEmpty(categories) && Object.entries(categories).map(([categoryId, categoryData]) => {
                  const categoryImage = _.find(uploadedCategoryLogos, { downloadURL: categoryData.image });
                  const categoryImageSmall = categoryData.imageSmall && _.find(uploadedCategoryLogos, { downloadURL: categoryData.imageSmall });
                  const allowedToDelete = !_.find(events, { category: categoryId });

                  return (
                    <tr key={`categoryeditor-${categoryId}`}>
                      <td className="media-left">
                        {categoryImage && <img className="image category-image" src={categoryImage.downloadURL} alt="" />}
                        {!categoryImage && <Translate id="nologo" />}
                      </td>
                      <td>
                        {categoryImageSmall && <img className="image is-32x32" src={categoryImageSmall.downloadURL} alt="" />}
                        {!categoryImageSmall && <Translate id="nosmallimage" />}
                      </td>
                      <td>
                        {categoryData.name}
                      </td>
                      <td>
                        {this.state.editingCategory === categoryId && <button className="button is-small is-success" onClick={() => this.changeEditedCategory(null)}><Translate id="editing" /></button>}
                        {this.state.editingCategory !== categoryId && <button className="button is-small is-info" onClick={() => this.changeEditedCategory(categoryId)}><Translate id="edit" /></button>}
                        {!allowedToDelete && <button disabled className="button is-small is-danger"><Translate id="cannotdelete" /></button>}
                        {allowedToDelete && <button className="button is-small is-danger" onClick={() => this.deleteCategory(categoryId)}><Translate id="delete" /></button>}
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
            <div className="column is-6">
              {editingCategory &&
                <CategoryEditorPanel
                  categoryId={editingCategory}
                  categoryData={categories[editingCategory]}
                  uploadedCategoryLogos={uploadedCategoryLogos}
                  pickingImage={pickingImage}
                  pickingSmallImage={pickingSmallImage}
                  chooseImagePicker={(update: State) => this.setState(update)}
                />
              }
            </div>
          </div>
        </div>
      );
    } if (!isLoaded(categories)) {
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

const categoryEntry = ({}) => {

};

interface CategoryEditorPanelProps {
  categoryId: string;
  categoryData: Category;
  uploadedCategoryLogos: {[key: string]: CategoryLogo};
  pickingImage: boolean;
  pickingSmallImage: boolean;
  chooseImagePicker: (update: State) => void;
}

const CategoryEditorPanel = ({ categoryId, categoryData, uploadedCategoryLogos, pickingImage, pickingSmallImage, chooseImagePicker }: CategoryEditorPanelProps) => (
  <div className="box">
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

    <div className="columns is-multiline">
      <div className="column is-6">
        <p>
          <Translate id="usedineventcards" />
        </p>
        <div className="level">
          <div className="level-left">
            <button className={`button categoryeditor-button is-outlined ${pickingImage && 'is-success'}`} onClick={() => chooseImagePicker({ pickingImage: true, pickingSmallImage: false })}>
              <Translate id="chooseimage" />
            </button>
          </div>
          <div className="level-right">
            {categoryData.image && <img className="image category-image" src={categoryData.image} alt="" />}
          </div>
        </div>
      </div>
      <div className="column is-6 box">
        <p>
          <Translate id="usedineventcalendar" />
        </p>

        <div className="level">
          <div className="level-left">
            <button className={`button categoryeditor-button is-outlined ${pickingSmallImage && 'is-success'}`} onClick={() => chooseImagePicker({ pickingImage: false, pickingSmallImage: true })}>
              <Translate id="choosesmallimage" />
            </button>
          </div>
          <div className="level-right">
            {categoryData.imageSmall && <img className="image category-image" src={categoryData.imageSmall} alt="" />}
          </div>
        </div>
      </div>
    </div>

    {pickingImage &&
    <ImagePicker
      imageList={uploadedCategoryLogos}
      highlightedImage={categoryData.image}
      path={`/categories/${categoryId}`}
      fieldName="image"
    />
    }

    {pickingSmallImage &&
    <ImagePicker
      imageList={uploadedCategoryLogos}
      highlightedImage={categoryData.imageSmall}
      path={`/categories/${categoryId}`}
      fieldName="imageSmall"
    />
    }

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
