import './App.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth"
import initializeAuthentication from './firebase/firebase.init';
import { useState } from 'react';

initializeAuthentication();
const googleProvider = new GoogleAuthProvider();

function App() {

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  const [isLogin, setLogin] = useState(false)

  const [name, setName] = useState('')
  const auth = getAuth();


  const toggleLogin = e => {
    setLogin(e.target.checked)
  }
  const handleNameChange = e => {
    setName(e.target.value)
  }
  const handleEmailChange = e => {
    setEmail(e.target.value)
  }
  const handlePasswordChange = e => {
    setPassword(e.target.value)
  }
  const handleRegistration = e => {
    e.preventDefault()
    if (password.length < 6) {
      setError("password must be at least 6 charactar long")
      return
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError('password must contain 2 uppercase')
      return
    }
    isLogin ? processLogin(email, password) : createNewUser(email, password);

  }
  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user)
        setError('')
      })
      .catch(error => { })
  }


  const createNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user)
        setError('')
        varifyEmail()
        setUserName()
      })
      .catch(error => {
        setError(error.message)
      })
  }

  const varifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result)

      })
  }
  const setUserName = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then(result => {

      })
  }
  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => {

      })
  }



  return (
    <div className="App container mt-5">
      <form onSubmit={handleRegistration}>

        <h3 className='text-danger'>PLease {isLogin ? 'Login' : 'Register'}</h3>

        {!isLogin && <div className="row mb-3">
          <label for="inputAddress2" class="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input onBlur={handleNameChange} type="text" className="form-control" id="inputName" placeholder="name" />
          </div>
        </div>}
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label" >Email</label>
          <div className="col-sm-10">
            <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label" >Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" required />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already registered ?
              </label>
            </div>
          </div>
        </div>
        <div className='row mb-3 text-danger'>{error}</div>
        <button type="submit" className="btn btn-primary">
          {isLogin ? 'Login' : 'Registar'}
        </button>
        <button onClick={handleResetPassword} type="button" className="btn btn-secondary btn-sm mx-2">Reset Password</button>

      </form>
      <div>--------------------------------------------------------------------------------</div>
      <br />  <br />   <br />
      {/* <button onClick={handleGoogleSignIn}>google sign in</button> */}
    </div>
  );
}

export default App;
