import GoogleLogin from '../components/google-login.jsx'
import LoginButton from '../components/login.jsx'
import SignUpButton from '../components/signup.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const clientId = "GOOGLE_CLIENT_ID"

export default function Login() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="welcome-page">
        <div className="content">
          <div className="title">CLike</div>
          <div className="subtitle">Connecting people together.</div>
        </div>
        <form className="main-form">
          <input type="text" className="form-field" id="email-input" placeholder="E-mail" />
          <input type="text" className="form-field" id="password-input" placeholder="Password" />
          <LoginButton />
          <div className="forgot-password">
            <a href="/reset-password">Forgot password?</a>
          </div>
          <SignUpButton />
          <GoogleLogin />
        </form>
      </div>
    </GoogleOAuthProvider>
  );
}