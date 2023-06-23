import "./login.css";

import { useContext, useEffect } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import fetchFn from "../../utils/fetchFn";
import { dialogContext } from "../../context/dialogContext";

import Loading from "../../components/loading/loading";

const googleURL = "https://accounts.google.com/o/oauth2/v2/auth?";
const googleOptions = {
   client_id: "450145178762-ve8m4krlq5cc02rp54ipkmtktlg58p11.apps.googleusercontent.com",
   redirect_uri: "http://localhost:5000/login",
   response_type: "token",
   scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
};

const facebookURL = "https://www.facebook.com/v16.0/dialog/oauth?";
const facebookOptions = {
   client_id: "1409874359834789",
   redirect_uri: "http://localhost:5000/login",
   response_type: "token",
   scope: "email",
};

function Login() {


   const navigate = useNavigate();
   const showDialog = useContext(dialogContext);

   const { mutate: addCartMutate } = useMutation({
      mutationFn: ({ path, body, sessionToken }) => fetchFn(path, "POST", sessionToken, body),
      onSuccess: () => navigate('/'),
      onError: (e) => showDialog(e.message),
   });

   const { mutate: logInMutate, isLoading } = useMutation({
      mutationFn: ({ path, body }) => fetchFn(path, "POST", null, body),
      onSuccess: (data) => {
         localStorage.setItem("ssID", data.sessionToken);
         localStorage.setItem("user", JSON.stringify(data));
         
         if (localStorage.getItem("cartItems")) {
            const cart = JSON.parse(localStorage.getItem("cartItems"));
            const bodyCart = cart.map(item => ({
               item_details_id: item.itemDetailsId,
               item_count: item.item_count,
            }));
            addCartMutate({
               path: "/cart/add",
               sessionToken: data.sessionToken,
               body: bodyCart,
            });
         } else {
            navigate('/');
         }
      },
      onError: (e) => showDialog(e.message),
   });

   useEffect(() => {
      const access_token = location.hash?.split("#access_token=")[1]?.split("&")[0];
      if (!access_token) return;
      const path = location.hash.includes("google") ? "google" : "facebook";

      logInMutate({
         path: `/user/auth/${path}`,
         body: { access_token }
      });

   }, []);

   return <div className="login-container">
      <img src="/icons/asr-logo.svg" alt="ASR logo" />
      <h1>Sign Up or Log In</h1>
      <p>No need for another password.<br />You can sign in using your accounts.</p>
      <a href={googleURL + new URLSearchParams(googleOptions).toString()} className="btn login-btn google relative">
         <img src="/icons/icons8-google.svg" alt="google logo" className="login-btn-img absolute" />
         with Google
      </a>
      <a href={facebookURL + new URLSearchParams(facebookOptions).toString()} className="btn login-btn facebook relative">
         <img src="/icons/facebook-logo.svg" alt="facebook logo" className="login-btn-img absolute" />
         with facebook
      </a>
      {
         isLoading && <Loading />
      }
   </div>;
}

export default Login;