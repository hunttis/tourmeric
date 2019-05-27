import firebase from 'firebase/app';
import 'firebase/auth';

export async function loginGoogle() {
  await firebase.login({
    provider: 'google',
    type: 'popup',
  });
}

export async function loginFacebook() {
  await firebase.login({
    provider: 'facebook',
    type: 'popup',
    scopes: ['email'],
  });
}

export function loginEmail(email: string, password: string) {
  return firebase.login({ email, password });
}

export function registerEmail(email: string, password: string) {
  const username = email.split('@')[0];
  return firebase.createUser({ email, password }, { email, username });
}

export async function logout() {
  await firebase.logout();
  window.location.reload();
}

export async function resetPassword(email: string) {
  await firebase.auth().sendPasswordResetEmail(email);
}
