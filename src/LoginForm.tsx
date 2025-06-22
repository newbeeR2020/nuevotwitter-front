import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase.tsx';
import {createAccount} from './api.ts';
import type {FormEvent} from 'react';
import type {User} from 'firebase/auth';
import type {UserPayload} from "./types";

interface LoginFormProps {
  user: User | null;
}

export default function LoginForm({ user }: LoginFormProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

// sign in handler
  const handleSignin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    };
  };
// sign up handler
  const handleSignup = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      setError('');
      setEmail('');
      setPassword('');
      const u: User = cred.user;
      const payload: UserPayload = {
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
      };
      await createAccount(payload);
    } catch (err: any) {
      setError(err.message);
    };
  };
// sign out handler
  const handleSignout = async () => {
    try {
      await signOut(auth);
      setError('');
    } catch (err: any) {
      setError(err.message);
    };
  };

  return (
    <div className="loginFormBox">
      {user ? <div>You are signed in!!</div> : <div>You are signed out!</div>}
      {/* when logged out */}
      {!user && (
        <>
          <h1>Sign in with Email and Password</h1>
          <section id="sectionSignin">
            <h2>Sign in / Sign up</h2>
            {/* sign in / sign up form */}
            <form onSubmit = {handleSignin}>
              <div>
                <label htmlFor="inputEmail">Email</label>
                <input type="email" name="inputEmail" id="inputEmail" value={email} onChange = {(e) => setEmail(e.target.value)} required/>
              </div>
              <div>
                <label htmlFor="inputPassword">Password</label>
                <input type="password" name="inputPassword" id="inputPassword" value={password} onChange = {(e) => setPassword(e.target.value)} required/>
              </div>
              <button type="submit" id="buttonSignin" aria-describedby="errorMessage" >Sign in</button>
              or
              <button type="button" id="buttonSignup" aria-describedby="errorMessage" onClick = {handleSignup}>Sign up</button>
            </form>
            {/* error message */}
            {error ? <p id = "errorMessage" style = {{color : "red"}}>{error}</p> : null}
          </section>
        </>
      )}
      {/* when logged in */}
      {user && (
        <>
          <section id="sectionUser">
            <h2>User Information</h2>
            {user ?
              <dl>
              <dt>user id</dt>
              <dd id="uid">{user.uid}</dd>
              <dt>user email address</dt>
              <dd id="uemail">{user.email}</dd>
            </dl>: null}
          </section>
          <section id="sectionSignout">
            <button type="button" id="buttonSignout" onClick = {handleSignout}>sign out</button>
          </section>
        </>
      )}
      {/* login status */}
    </div>
  );
}