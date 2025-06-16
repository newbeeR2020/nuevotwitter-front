import { useState, useEffect } from 'react'
import './App.css'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.tsx';
import LoginForm from './LoginForm.js';
import type {User} from 'firebase/auth';



function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;          // アンマウント時に購読解除
  }, []);

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <LoginForm user = {user} />
      {user ? <div>You are signed in!!</div> : <div>You are signed out!</div>}
    </>
  )
}

export default App
