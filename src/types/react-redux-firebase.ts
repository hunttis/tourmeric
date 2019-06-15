import firebase from 'firebase/app';

declare module 'firebase/app' {
  function update(path: string, value: any): Promise<any>;
  function set(path: string, value: any): Promise<any>;
  function push(path: string, value: any): Promise<firebase.database.Reference>;
  function uploadFiles(path: string, value: any): Promise<any>;
  function remove(path: string, value: any): Promise<any>;

  function login(logininfo: any): Promise<any>;
  function logout(): Promise<any>;
  function createUser(loginInfo: { email: string, password: string }, userInfo: { email: string, username: string }): Promise<any>;
}
