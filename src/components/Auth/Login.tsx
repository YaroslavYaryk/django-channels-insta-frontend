import React, { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { user, login } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const { username, password } = values;

      try {
        const res = await login(username, password);
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          text: err.response.data.message,
        });
        //   setError(res.data.detail);
        console.log(err);
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
      {/* © Mohammad Muazam */}
      <title>Instagram</title>
      <link rel="icon" type="image/png" href="logo.png" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Lobster"
      />
      <link
        rel="stylesheet"
        href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
        integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="style.css" />
      {/* This contains all the content that we want to show to web users when they visit your page.
       */}
      <div className="container">
        <div className="col image">
          <a href="">
            <img
              src="https://i.ibb.co/Q8X79RK/image.png"
              alt="instagram"
              id="image"
            />
          </a>
        </div>
        {/*end of image*/}
        <div className="col content">
          <div className="box">
            <div className="title">
              <a href="">
                <img
                  src="https://i.ibb.co/2dCLRGv/logoname.png"
                  alt="logoname"
                />
              </a>
            </div>
            <form className="login-form" onSubmit={formik.handleSubmit}>
              <div className="form-content">
                <input
                  type="text"
                  name="username"
                  required
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  placeholder="Phone number, username, or email"
                />
              </div>
              <div className="form-content">
                <input
                  type="password"
                  name="password"
                  required
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  placeholder="Password"
                />
              </div>
              <div className="form-content">
                <button
                  className="bg-sky-600"
                  style={{ background: "sky" }}
                  type="submit"
                >
                  Log in
                </button>
              </div>
              <div className="form-ending">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <p id="OR">OR</p>
                  <span id="line" />
                </div>
                <p id="facebook">
                  <i className="fab fa-facebook-square" />
                  Login with Facebook
                </p>
                <a href="#">Forgot password?</a>
              </div>
            </form>
          </div>
          <div className="mini-box">
            <div className="text">
              Don't have an account?{" "}
              <Link to={"/registration/"}>
                {" "}
                <span style={{}}>Sign Up</span>{" "}
              </Link>
            </div>
          </div>
          <div className="download-section">
            <p>Get the app.</p>
            <div className="images">
              <a href="">
                <img
                  src="https://i.ibb.co/5KyMHpd/appstore.png"
                  alt="appstore"
                />
              </a>
              <a href="">
                <img
                  src="https://i.ibb.co/ZTHhz0b/playstore.png"
                  alt="playstore"
                />
              </a>
            </div>
          </div>
        </div>
        {/*end of content*/}
      </div>
      <footer>
        <ul>
          <li>About</li>
          <li>Blog</li>
          <li>Jobs</li>
          <li>Help</li>
          <li>API</li>
          <li>Privacy</li>
          <li>Terms</li>
          <li>Top Accounts</li>
          <li>Hashtags</li>
          <li>Locations</li>
        </ul>
        <div className="copyright">
          <select aria-label="Switch Display Language">
            <option value="en">English</option>

            <option value="pl">Polski</option>

            <option value="uk">Українська</option>
          </select>
          <span> © 2021 Instagram from Facebook </span>
        </div>
      </footer>
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
    //         Sign in to your account
    //       </h1>
    //     </div>
    //     <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
    //       {error && <div>{JSON.stringify(error)}</div>}

    //       <div className=" rounded-md">
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
    //         {formik.isSubmitting ? "Signing in..." : "Sign in"}
    //       </button>
    //     </form>
    //     <div className="registerLogin">
    //       <p>
    //         Already have an account?{" "}
    //         <Link to={"/registration/"}>
    //           <span style={{ color: "blue", marginLeft: "10px" }}>
    //             Register
    //           </span>
    //         </Link>
    //       </p>
    //     </div>
    //   </div>
    // </div>
  );
}
