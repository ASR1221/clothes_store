import "./login.css";

function Login() {

   // this should be inside a use effect?
   // async function handleSignUp(e) {
   //    e.preventDefault();
   //    const access_token = window.location.hash?.split("#access_token=")[1]?.split("&")[0];
   //    console.log(access_token);
   //    const replay = await fetch("/api/user/auth/google", {
   //       method: "POST",
   //       headers: {
   //          "Content-Type": "application/json",
   //       },
   //       body: JSON.stringify({ access_token }),
   //    });
   //    const data = await replay.json();
   //    console.log(data.sessionToken);
   // }

   return <div className="login-container">
      <img src="/icons/asr-logo.svg" alt="ASR logo" />
      <h1>Sign Up or Log In</h1>
      <p>No need for another password.<br />You can sign in using your accounts.</p>
      <button className="btn login-btn google relative">
         <img src="/icons/icons8-google.svg" alt="google logo" className="login-btn-img absolute" />
         with Google
      </button>
      <button className="btn login-btn facebook relative">
         <img src="/icons/facebook-logo.svg" alt="facebook logo" className="login-btn-img absolute" />
         with facebook
      </button>
      <br />
   </div>;
}

export default Login;