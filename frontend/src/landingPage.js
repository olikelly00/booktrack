import { TypeAnimation } from "react-type-animation";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [emailSuccessfullyAdded, setEmailSuccessfullyAdded] = useState(false);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [passwordLengthValid, setPasswordLengthValid] = useState(false);
  const [passwordContainsNumber, setPasswordContainsNumber] = useState(false);
  const [
    passwordContainsSpecialCharacter,
    setPasswordContainsSpecialCharacter,
  ] = useState(false);
  const [passwordContainsCapitalLetter, setPasswordContainsCapital] =
    useState(false);
  const [passwordContainsLowercase, setPasswordContainsLowercaseLetter] =
    useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  async function addNewUser(e) {
    e.preventDefault();
    console.log("Form data being sent:", formData);
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if the response was successful
      if (response.ok) {
        console.log("User added successfully");
        setEmailSuccessfullyAdded(true);
        setEmailAlreadyExists(false);
        setTimeout(() => {
          navigate("/login");
        }, 2000);

        // Optional: redirect to the login page or show a success message
      } else {
        // Handle server-side error, e.g., user already exists or validation errork
        const errorMessage = await response.text();
        console.error("Server error:", errorMessage);
        console.log(errorMessage);
        if (errorMessage === "Email already exists in database") {
          setEmailAlreadyExists(true);
          setEmailSuccessfullyAdded(false);
        }
      }
    } catch (error) {
      console.error("An error happened:", error); // Log any network errors
    }
  }

  async function checkPasswordContainsLowercaseLetter(password) {
    let regex = /^(?=.*[a-z])/;
    console.log("EHHLO");
    return regex.test(password);
  }

  async function checkPasswordContainsCapital(password) {
    let regex = /^(?=.*[A-Z])/;
    console.log("EHHLO");
    return regex.test(password);
  }

  async function checkPasswordContainsSpecial(password) {
    let regex = /^(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]/;
    console.log("EHHLO");
    return regex.test(password);
  }

  async function checkPasswordContainsNumber(password) {
    let regex = /^(?=.*\d)/;
    return regex.test(password);
  }

  async function checkPasswordLongEnough(password) {
    return password.length >= 8;
  }

  async function checkPasswordValidity(e) {
    e.preventDefault();
    const validPasswordLength = await checkPasswordLongEnough(e.target.value);
    setPasswordLengthValid(validPasswordLength);
    const passwordContainsLowercase =
      await checkPasswordContainsLowercaseLetter(e.target.value);
    setPasswordContainsLowercaseLetter(passwordContainsLowercase);
    const passwordContainsNumber = await checkPasswordContainsNumber(
      e.target.value,
    );
    setPasswordContainsNumber(passwordContainsNumber);
    const passwordContainsCapital = await checkPasswordContainsCapital(
      e.target.value,
    );
    setPasswordContainsCapital(passwordContainsCapital);
    const passwordContainsSpecial = await checkPasswordContainsSpecial(
      e.target.value,
    );
    setPasswordContainsSpecialCharacter(passwordContainsSpecial);
  }

  return (
    <>
      <div className="relative bg-default-bg-color">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
          <div className="px-6 pt-10 pb-24 sm:pb-32 lg:col-span-7 lg:px-0 lg:pt-48 lg:pb-56 xl:col-span-6">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <img
                className="h-11"
                src="./logo-no-background.png"
                alt="Your Company"
              />
              <div className="hidden sm:mt-32 sm:flex lg:mt-16">
                <div className="relative rounded-full py-1 px-3 text-sm leading-6 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  Anim aute id magna aliqua ad ad non deserunt sunt.{" "}
                  <a
                    href="#"
                    className="whitespace-nowrap font-semibold text-indigo-600"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    Read more <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
              <h1 className="mt-24 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
                Track your<br></br>
                <TypeAnimation
                  sequence={[
                    4000,
                    "standout stories",
                    4000,
                    "movie marathon",
                    4000,
                    "beloved binge-watch",
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />{" "}
                <br></br>with TrackIt
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
                fugiat aliqua.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <a
                  href="#signup-view"
                  className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </a>
                <a
                  href="./signup.js"
                  className="text-base font-semibold leading-7 text-gray-900"
                >
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
          <div className="relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
            <img
              className="aspect-[3/2] w-full bg-gray-50 object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
              src="./asset.webp"
              alt=""
            />
          </div>
        </div>
      </div>

      <div id="signup-view">
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8  bg-default-bg-color">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-12 w-auto"
              src="./logo-no-background.png"
              alt="logo"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign up for your account
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={addNewUser} method="POST">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      id="first_name"
                      name="first_name"
                      type="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      autoComplete="first_name"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      id="last_name"
                      name="last_name"
                      type="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      autoComplete="last_name"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  {emailAlreadyExists && (
                    <p className="mt-2 text-error-text text-sm">
                      Looks like this email address is already registered.
                      <br></br>Click here to login.
                    </p>
                  )}
                  {emailSuccessfullyAdded && (
                    <p className="mt-2 text-success-text text-sm">
                      You're all set! Redirecting you to the login page...
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onKeyUp={checkPasswordValidity}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-2 text-sm">
                    Your password must:
                    <div
                      className={`mt-2 ${passwordLengthValid ? "text-success-text" : "text-error-text"} text-sm`}
                    >
                      Be at least 8 characters Long
                    </div>
                    <div
                      className={`mt-2 ${passwordContainsCapitalLetter ? "text-success-text" : "text-error-text"} text-sm`}
                    >
                      Have at least 1 uppercase letter (A-Z)
                    </div>
                    <div
                      className={`mt-2 ${passwordContainsLowercase ? "text-success-text" : "text-error-text"} text-sm`}
                    >
                      {" "}
                      Have at least 1 lowercase letter (a-z)
                    </div>
                    <div
                      className={`mt-2 ${passwordContainsNumber ? "text-success-text" : "text-error-text"} text-sm`}
                    >
                      Have at least one number
                    </div>
                    <div
                      className={`mt-2 ${passwordContainsSpecialCharacter ? "text-success-text" : "text-error-text"} text-sm`}
                    >
                      Have at least 1 special character
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
