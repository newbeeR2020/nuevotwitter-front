import { useState, useEffect } from 'react'
import './App.css'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.tsx';
import LoginForm from './LoginForm.js';
import {fetchTweets, addTweet, likeTweet} from './api.ts';
import type {User} from 'firebase/auth';
import type {Tweet, TweetPayload } from './types.ts'
import type {FormEvent} from 'react';
import TweetItem from './TweetItem.tsx'




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
  }, [count]);

  const handleTweet = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tweet == "") {
      alert ("You have to enter something to tweet!!");
      return;
    }
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

  const handleReply = async (parentId: string, tweet: string) => {
    if (tweet == "") {
      alert ("You have to enter something to reply!!");
      return;
    }
    const payload: TweetPayload = {text: tweet, replyToId: parentId, visibility: "public"};
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
  const renderThread = (tweet: Tweet) => (
    <div key={tweet.id}>
      <TweetItem
        tweet={tweet}
        onLike={handleLike}
        onReply={handleReply}
      />
      {TL
        .filter(child => child.replyToId === tweet.id)
        .map(child => (
          <div key={child.id} className="reply">
            {renderThread(child)}
          </div>
        ))
      }
    </div>
  )
  return (
    <div className="appContainer">
      <LoginForm user = {user} />
      {user && (
        <main className="mainContainer">
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              Reload tweets
            </button>
          </div>
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
            {TL
              .filter(t => !t.replyToId)
              .map(parent => renderThread(parent))
            }
          </div>
        </main>
      )}
    </div>
  )
}

export default App
