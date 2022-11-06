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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className=" space-y-8"
        style={{
          border: "1px solid grey",
          padding: "40px",
          borderRadius: 20,
          background: "#BABACA",
        }}
      >
        <div>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h1>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          {error && <div>{JSON.stringify(error)}</div>}

          <div className=" rounded-md">
            <input
              value={formik.values.username}
              onChange={formik.handleChange}
              type="text"
              name="username"
              placeholder="Username"
              className="border-gray-300 text-gray-900 placeholder-black-400 focus:ring-gray-500 focus:border-gray-500 block w-full pr-10 focus:outline-none sm:text-sm  mb-5"
            />
            <input
              value={formik.values.password}
              onChange={formik.handleChange}
              type="password"
              name="password"
              className="border-gray-300 text-gray-900 placeholder-black-400  focus:ring-gray-500 focus:border-gray-500 block w-full pr-10 focus:outline-none sm:text-sm "
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            {formik.isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="registerLogin">
          <p>
            Already have an account?{" "}
            <Link to={"/registration/"}>
              <span style={{ color: "blue", marginLeft: "10px" }}>
                Register
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
