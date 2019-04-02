import firebase from 'firebase/app';

declare module 'firebase/app' {
  function update(path: string, value: any): Promise<any>;
  function set(path: string, value: any): Promise<any>;
  function push(path: string, value: any): Promise<any>;
}
