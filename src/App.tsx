import { useState, useEffect } from 'react'
import './App.css'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.tsx';
import LoginForm from './LoginForm.js';
import {fetchTweets, addTweet, likeTweet} from './api.ts';
import type {User} from 'firebase/auth';
import type {Tweet, TweetPayload } from './types.ts'



function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState<User | null>(null);
  const [tweet, setTweet] = useState("");
  const [error, setError] = useState("");
  const [TL, setTL] = useState<Tweet[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    (async () => {
      try {
        setError("");
        const response = await fetchTweets();
        setTL(response.data);
      } catch (err: any) {
        setError(err.message);
      }
    })();
    return unsub;          // アンマウント時に購読解除
  }, []);

  const handleTweet = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const payload: TweetPayload = {text: tweet, visibility: "public"};
    try {
      setError("");
      await addTweet(payload);
      setTweet("");
      const response = await fetchTweets();
      setTL(response.data);    } catch (err: any) {
      setError(err.message);
    }
  }

  const handleLike = async (id: string) => {
    try {
      await likeTweet(id);
    } catch (err: any) {
      setError(err.message);
    }
  }
  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <LoginForm user = {user} />
      {user ? <div>You are signed in!!</div> : <div>You are signed out!</div>}
      <div className="postingBox">
        <h2>post a tweet (tweet a tweet)</h2>
        <form onSubmit={handleTweet}>
          <label>Your tweet</label>
          <input type="text" value={tweet} onChange = {(e) => setTweet(e.target.value)}></input>
          <button type="submit">tweet</button>
        </form>
        {error ? <p id = "errorMessage" style = {{color : "red"}}>{error}</p> : null}
      </div>
      <div className="TL">
        <h2>Tweets</h2>
        {TL.map((t) => (
          <div className="tweetWindow">
            <p>text: {t.text}</p>
            <p>author id: {t.authorId}</p>
            <button onClick={ () => handleLike(t.id)}>Like❤️</button>
            <button >Reply🔥</button>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
