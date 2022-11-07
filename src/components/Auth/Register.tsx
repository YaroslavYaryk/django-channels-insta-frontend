import React, { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

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
    <div className="container-register">
      <div className="box-register">
        <div className="heading" />
        <form className="login-form" onSubmit={formik.handleSubmit}>
          <div className="field">
            <input
              name="firstName"
              placeholder="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              type="text"
            />
          </div>
          <div className="field">
            <input
              name="lastName"
              placeholder="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              type="text"
            />
          </div>
          <div className="field">
            <input
              name="username"
              placeholder="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              type="text"
            />
          </div>
          <div className="field">
            <input
              name="password"
              type="password"
              placeholder="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
          </div>
          <button className="login-button" title="login">
            Sign Up
          </button>
          <div className="separator">
            <div className="line" />
            <p>OR</p>
            <div className="line" />
          </div>
          <div className="other">
            <button className="fb-login-btn" type="button">
              <i className="fa fa-facebook-official fb-icon" />
              <span className="">Log in with Facebook</span>
            </button>
          </div>
        </form>
      </div>
      <div className="mini-box">
        <div className="text">
          Already have an account?{" "}
          <Link to={"/login/"}>
            {" "}
            <span style={{ color: "#5b9af7" }}>Sign In</span>{" "}
          </Link>
        </div>
      </div>
      <footer style={{ width: "100%" }}>
        <ul style={{ width: "100%" }}>
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
    </div>

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
