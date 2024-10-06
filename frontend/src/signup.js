import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
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
        navigate("/login");

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
                  <p className="mt-2 text-red-500 text-sm">
                    Looks like this email address is already registered.
                    <br></br>Click here to login.
                  </p>
                )}
                {emailSuccessfullyAdded && (
                  <p className="mt-2 text-green-500 text-sm">
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
                    className={`mt-2 ${passwordLengthValid ? "text-green-500" : "error-color"} text-sm`}
                  >
                    Be at least 8 characters Long
                  </div>
                  <div
                    className={`mt-2 ${passwordContainsCapitalLetter ? "text-green-500" : "error-color"} text-sm`}
                  >
                    Have at least 1 uppercase letter (A-Z)
                  </div>
                  <div
                    className={`mt-2 ${passwordContainsLowercase ? "text-green-500" : "error-color"} text-sm`}
                  >
                    {" "}
                    Have at least 1 lowercase letter (a-z)
                  </div>
                  <div
                    className={`mt-2 ${passwordContainsNumber ? "text-green-500" : "error-color"} text-sm`}
                  >
                    Have at least one number
                  </div>
                  <div
                    className={`mt-2 ${passwordContainsSpecialCharacter ? "text-green-500" : "error-color"} text-sm`}
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
    </>
  );
}
