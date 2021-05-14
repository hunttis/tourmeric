import React, { useState } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import { MarkdownElement } from '../../../components/Common/MarkdownElement';
import { Article } from '../../../models/ReduxState';
import EditableTextarea from '../../../components/Common/EditableTextarea';
import EditableVerticalField from '../../../components/Common/EditableVerticalField';
import { UploadedFile } from '../../../models/Category';
import { ImagePickerWithCallback } from '../ImagePickerWithCallback';

interface Props {
  articleId: string;
  article: Article;
  uploadedArticleImages: [{ key: string, value: UploadedFile}];
}

export const ArticleMarkdown = ({ articleId, article, uploadedArticleImages }: Props) => {

  const [imagePickerOpen, setImagePickerOpen] = useState<boolean>(false);

  if (!article) {
    return <div className="is-loading">Loading...</div>;
  }

  return (
    <div className="section">
      <div className="columns is-multiline">
        <div className="column is-4">
          <h1 className="title"><Translate id="editarticle" /></h1>
        </div>
        <div className="column is-2 has-text-right">
          <ImagePickerButton imagePickerOpen={imagePickerOpen} setImagePickerOpen={setImagePickerOpen} />
        </div>
        <div className="column is-6">
          <h1 className="title"><Translate id="preview" /></h1>
        </div>
        {!imagePickerOpen &&
          <div className="column is-6">
            <p className="content is-marginless"><Translate id="articletitle" /></p>
            <EditableVerticalField
              labelContent=""
              placeHolder="articletitle"
              defaultValue={article.title}
              path={`/articles/${articleId}`}
              targetName="title"
            />
            <p className="content is-marginless"><Translate id="articlecontent" /></p>
            <EditableTextarea
              labelContent=""
              placeHolder="contentplaceholder"
              defaultValue={article.content}
              path={`/articles/${articleId}`}
              rows={50}
              targetName="content"
            />
          </div>
        }
        {imagePickerOpen &&
          <div className="column is-6">
            <ImagePickerWithCallback
              imageList={uploadedArticleImages}
              onClickCallback={(url: string) => { firebase.update(`/articles/${articleId}`, { content: `![alt text](${url} "image hover text")\n\n${article.content}` }); }}
            />
          </div>
        }
        <div className="column is-6" id="preview">
          <h1 className="title has-text-info has-text-centered">{article.title}</h1>
          <MarkdownElement markdown={article.content} />
        </div>
        <div className="column is-6 has-text-right">
          <a className="button is-small is-primary" target="_blank" rel="noopener noreferrer" href="https://www.markdownguide.org/cheat-sheet/">
            <span className="icon has-text-success is-paddingless is-marginless"><i className="fas fa-question" /></span>
            <Translate id="help" /> - <Translate id="markdowncheatsheet" />
          </a>
        </div>
        <div className="column is-6">
          <Translate id="allbasicfeaturessupported" />
        </div>
      </div>
    </div>
  );
};

interface ImagePickerButtonProps {
  imagePickerOpen: boolean;
  setImagePickerOpen: (status: boolean) => void;
}

const ImagePickerButton = ({ imagePickerOpen, setImagePickerOpen }: ImagePickerButtonProps) => (
  <>
    {!imagePickerOpen &&
      <button className="button has-icon-left" onClick={() => setImagePickerOpen(true)}>
        <span className="icon has-text-success is-paddingless is-marginless"><i className="fas fa-plus" /></span>
        <span className="icon is-paddingless is-marginless"><i className="fas fa-image" /></span>
        <span><Translate id="addimage" /></span>
      </button>
    }
    {imagePickerOpen &&
      <button className="button has-icon-left is-warning is-outlined" onClick={() => setImagePickerOpen(false)}>
        <span className="icon has-text-success is-paddingless is-marginless"><i className="fas fa-plus" /></span>
        <span className="icon is-paddingless is-marginless"><i className="fas fa-image" /></span>
        <span><Translate id="closeimagepicker" /></span>
      </button>
    }
  </>
);
