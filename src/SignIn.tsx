import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"

const SignIn = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()

  function submitForm() {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setEmail('')
        setPassword('')

        navigate('/home')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        setEmail('')
        setPassword('')

        if (errorCode == "auth/wrong-password") {
          alert("Wrong Password")
        }

        if (errorCode == "auth/user-not-found") {
          alert("Account not found")
        }
      });
  }

  return (
    <div className="mt-4 w-fit mx-auto flex flex-col items-center border-2 border-black border-solid rounded-lg px-10 py-4 pb-8">
      <h2>Sign in to your account</h2>
      <form className="flex flex-col gap-4 mt-4" onSubmit={(e) => { e.preventDefault(); submitForm() }}>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="px-3 py-1 text-base border-neutral-600 border-[1px] focus:outline-blue-900 rounded-full" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="px-3 py-1 text-base border-neutral-600 border-[1px] focus:outline-blue-900 rounded-full" />
        </div>
        <input type="submit" value="Sign In" className="cursor-pointer border-none bg-blue-600 px-3 py-2 mt-2 text-base font-semibold text-white rounded-full" />
        <p>Doesn't have a account? <NavLink to={'/register'} className="text-orange-600">Click here to create one</NavLink></p>
      </form>
    </div>
  )
}

export default SignIn