// import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"

function writeInitialUserData(userId: string, name: string) {
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name,
    difficulties: [
      ['easy', { bestTime: 0, lastTime: 0, won: 0, lost: 0, id: 1 }],
      ['medium', { bestTime: 0, lastTime: 0, won: 0, lost: 0, id: 2 }],
      ['hard', { bestTime: 0, lastTime: 0, won: 0, lost: 0, id: 3 }]
    ]
  });
}

const Register = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const navigate = useNavigate()

  function submitForm() {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        writeInitialUserData(user.uid, username)

        // setActualUsername(username)
        setUsername('')
        setEmail('')
        setPassword('')

        navigate('/home')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode == "auth/email-already-in-use") {
          alert('This email is already in use')
        }

        setUsername('')
        setEmail('')
        setPassword('')
      });
  }

  return (
    <div className="mt-4 w-fit mx-auto flex flex-col items-center border-2 border-black border-solid rounded-lg px-10 py-4 pb-8">
      <h2>Create a account</h2>
      <form className="flex flex-col gap-4 mt-4" onSubmit={(e) => { e.preventDefault(); submitForm() }}>
        <div className="flex flex-col gap-1">
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} minLength={4} required className="px-3 py-1 text-base border-neutral-600 border-[1px] focus:outline-blue-900 rounded-full min-w-[300px]" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="px-3 py-1 text-base border-neutral-600 border-[1px] focus:outline-blue-900 rounded-full min-w-[300px]" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="px-3 py-1 text-base border-neutral-600 border-[1px] focus:outline-blue-900 rounded-full" />
        </div>
        <input type="submit" value="Create Account" className="cursor-pointer border-none bg-orange-600 px-3 py-2 mt-2 text-base font-semibold text-white rounded-full" />
        <p>Already have one? <NavLink to={'/'} className="text-blue-600">Click here to sign in</NavLink></p>
      </form>
    </div>
  )
}

export default Register