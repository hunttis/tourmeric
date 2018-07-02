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
  });
}

export async function loginEmail(email, password) {
  return firebase.login({ email, password });
}

export async function registerEmail(email, password) {
  const username = email.split('@')[0];
  return firebase.createUser({ email, password }, { email, username });
}

export async function logout() {
  await firebase.logout();
  window.location.reload();
}
