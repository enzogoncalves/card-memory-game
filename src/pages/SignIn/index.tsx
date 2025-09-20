import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"
import { GameContext } from "../../contexts/GameContext";

const SignIn = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()
	const { userLoaded } = useContext(GameContext)

	useEffect(() => {
		if(userLoaded) {
			navigate('/')
		}
	}, [])

  function submitForm() {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setEmail('')
        setPassword('')
				navigate('/')
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
    <div className="w-fit mx-auto flex flex-col items-center border-2 border-black dark:border-zinc-50 border-solid rounded-lg px-10 py-4 pb-8">
      <h2 className="dark:text-text-color">Sign in to your account</h2>
      <form className="flex flex-col gap-7 mt-6 dark:text-text-color" onSubmit={(e) => { e.preventDefault(); submitForm() }}>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" placeholder="Type your email here" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" placeholder="Type your password here" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input" />
        </div>
        <input type="submit" value="Sign In" className="form-input-submit bg-blue-600 hover:bg-blue-700 dark:bg-[#4392f1] dark:hover:bg-[#2c71c5]" />
        <p>Doesn't have a account? <NavLink to={'/register'} className="text-[#ff7f11]">Click here to create one</NavLink></p>
      </form>
    </div>
  )
}

export default SignIn