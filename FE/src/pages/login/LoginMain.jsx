import React, { useState } from "react";
import LoginForm from "./components/login/LoginForm";
import GoogleForm from "./components/login/GoogleForm";
import EmailSignupForm from "./EmailSignupForm";

export default function Login() {
  return (
    <>
      <div>
        <br />
        <div>
          <GoogleForm />
        </div>
        <div>
          <LoginForm />
        </div>
        <div>
          <EmailSignupForm />
        </div>
        <br />
      </div>
    </>
  );
}
