import React from 'react';
import { isLoaded } from 'react-redux-firebase';
import { UploadedFile } from '../../../models/Category';

interface Props {
  uploadedCategoryLogos: { [key: string]: UploadedFile };
}

export const UploadedCategoryLogosLoader = ({ uploadedCategoryLogos }: Props) => (
  <span className={`${process.env.NODE_ENV === 'production' && 'is-hidden'} ${isLoaded(uploadedCategoryLogos) ? 'has-text-success ' : 'has-text-warning'}`}>- UploadedCategoryLogos - </span>
);
