export interface Category {
  abbreviation: string;
  formats?: string;
  image?: string;
  imageSmall?: string | null;
  logo: string;
  name: string;
  type: string;
}

export interface UploadedFile {
  downloadURL: string;
  name: string;
}
