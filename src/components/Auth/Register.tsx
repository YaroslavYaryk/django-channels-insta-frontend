import React, { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Swal from "sweetalert2";

export function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { user, register } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const { firstName, lastName, username, password } = values;
      try {
        const res = await register(firstName, lastName, username, password);
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          text: err.response.data.message,
        });
        //   setError(res.data.detail);
        console.log(err.response.data.message);
        return;
      }

      navigate("/");
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <>
      <span id="root">
        <section className="section-all">
          {/* 1-Role Main */}
          <main className="main" role="main">
            <div className="wrapper">
              <article className="article">
                <div className="content">
                  <div className="login-box">
                    <div className="header">
                      <img
                        className="logo"
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
                        alt="Instagram"
                      />
                    </div>
                    {/* Header end */}
                    <div className="form-wrap">
                      <form className="form">
                        <div className="input-box">
                          <input
                            type="text"
                            id="name"
                            aria-describedby=""
                            placeholder="Phone number, username, or email"
                            aria-required="true"
                            maxLength={30}
                            autoCapitalize="off"
                            autoCorrect="off"
                            name="username"
                            defaultValue=""
                            required
                          />
                        </div>
                        <div className="input-box">
                          <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            aria-describedby=""
                            maxLength={30}
                            aria-required="true"
                            autoCapitalize="off"
                            autoCorrect="off"
                            required
                          />
                        </div>
                        <span className="button-box">
                          <button className="btn" type="submit" name="submit">
                            Log in
                          </button>
                        </span>
                        <a className="forgot" href="">
                          Forgot password?
                        </a>
                      </form>
                    </div>{" "}
                    {/* Form-wrap end */}
                  </div>{" "}
                  {/* Login-box end */}
                  <div className="login-box">
                    <p className="text">
                      Don't have an account?<a href="#">Sign up</a>
                    </p>
                  </div>{" "}
                  {/* Signup-box end */}
                  <div className="app">
                    <p>Get the app.</p>
                    <div className="app-img">
                      <a href="https://itunes.apple.com/app/instagram/id389801252?pt=428156&ct=igweb.loginPage.badge&mt=8">
                        <img src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/4b70f6fae447.png" />
                      </a>
                      <a href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=utm_source%3Dinstagramweb%26utm_campaign%3DloginPage%26utm_medium%3Dbadge">
                        <img src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/f06b908907d5.png" />
                      </a>
                    </div>{" "}
                    {/* App-img end*/}
                  </div>{" "}
                  {/* App end */}
                </div>{" "}
                {/* Content end */}
              </article>
            </div>{" "}
            {/* Wrapper end */}
          </main>
          {/* 2-Role Footer */}
          <footer className="footer" role="contentinfo">
            <div className="footer-container">
              <nav className="footer-nav" role="navigation">
                <ul>
                  <li>
                    <a href="">About Us</a>
                  </li>
                  <li>
                    <a href="">Support</a>
                  </li>
                  <li>
                    <a href="">Blog</a>
                  </li>
                  <li>
                    <a href="">Press</a>
                  </li>
                  <li>
                    <a href="">Api</a>
                  </li>
                  <li>
                    <a href="">Jobs</a>
                  </li>
                  <li>
                    <a href="">Privacy</a>
                  </li>
                  <li>
                    <a href="">Terms</a>
                  </li>
                  <li>
                    <a href="">Directory</a>
                  </li>
                  <li>
                    <span className="language">
                      Language
                      <select name="language" className="select">
                        <option value="#">English</option>
                        <option value="http://ru-instafollow.bitballoon.com">
                          Russian
                        </option>
                      </select>
                    </span>
                  </li>
                </ul>
              </nav>
              <span className="footer-logo">© 2018 Instagram</span>
            </div>{" "}
            {/* Footer container end */}
          </footer>
        </section>
      </span>{" "}
      {/* Root */}
      {/* Select Link */}
    </>

    // <div
    //   style={{
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   <div
    //     className=" space-y-8"
    //     style={{
    //       border: "1px solid grey",
    //       padding: "40px",
    //       borderRadius: 20,
    //       background: "#BABACA",
    //     }}
    //   >
    //     <div>
    //       <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
    //         Sign up to your account
    //       </h1>
    //     </div>

    //     <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
    //       {error && <div>{JSON.stringify(error)}</div>}

    //       <div className=" rounded-md">
    //         <input
    //           value={formik.values.firstName}
    //           onChange={formik.handleChange}
    //           type="text"
    //           name="firstName"
    //           placeholder="First Name"
    //           className="border-gray-300 text-gray-900 placeholder-black-400 focus:ring-gray-500 focus:border-gray-500 block w-full pr-10 focus:outline-none sm:text-sm  mb-5"
    //         />
    //         <input
    //           value={formik.values.lastName}
    //           onChange={formik.handleChange}
    //           type="text"
    //           name="lastName"
    //           placeholder="Last Name"
    //           className="border-gray-300 text-gray-900 placeholder-black-400 focus:ring-gray-500 focus:border-gray-500 block w-full pr-10 focus:outline-none sm:text-sm  mb-5"
    //         />
    //         <input
    //           value={formik.values.username}
    //           onChange={formik.handleChange}
    //           type="text"
    //           name="username"
    //           placeholder="Username"
    //           className="border-gray-300 text-gray-900 placeholder-black-400 focus:ring-gray-500 focus:border-gray-500 block w-full pr-10 focus:outline-none sm:text-sm  mb-5"
    //         />
    //         <input
    //           value={formik.values.password}
    //           onChange={formik.handleChange}
    //           type="password"
    //           name="password"
    //           className="border-gray-300 text-gray-900 placeholder-black-400  focus:ring-gray-500 focus:border-gray-500 block w-full pr-10 focus:outline-none sm:text-sm "
    //           placeholder="Password"
    //         />
    //       </div>

    //       <button
    //         type="submit"
    //         className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
    //       >
    //         {formik.isSubmitting ? "Signing up..." : "Sign up"}
    //       </button>
    //     </form>
    //   </div>
    // </div>
  );
}
