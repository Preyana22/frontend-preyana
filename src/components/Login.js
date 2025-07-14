import React, { useEffect, useState } from "react";
import destination_3 from "../assets/images/banner.png";

import { Link, useNavigate } from "react-router-dom";
import googleimage from "../assets/images/google.png";
import facebookimage from "../assets/images/facebook.png";
import axios from "axios";
import { Carousel } from "react-bootstrap";
import FacebookLogin from "react-facebook-login";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
const apiUrl = process.env.REACT_APP_API_BASE_URL;
const clientId = "1073690059873-28hdq2apdgh7m9n0otk1ga0fp3ehrvlk.apps.googleusercontent.com";
const Login = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [login, setLogin] = useState();
  const [hidePassword, sethidePassword] = useState(true);
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear validation errors when input changes
  };

  //Toggle password visibility
  const managePasswordVisibility = () => {
    sethidePassword((hidePassword) => !hidePassword);
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const newErrors = {};
    if (formData.username.trim() === "") {
      newErrors.username = "Username is required";
    }
    if (formData.password.trim() === "") {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        // Form is valid, submit the data or perform other actions
        console.log("Form data:", formData);
        const configuration = {
          method: "post",
          url: apiUrl + "/authentication/log-in",
          data: {
            email: formData.username,
            password: formData.password,
          },
        };
        console.log("configuration");
        console.log(configuration);
        const result = await axios(configuration);
        console.log("result");
        console.log(result);
        localStorage.setItem("email", result.data.email);
        localStorage.setItem("userName", result.data.userName);
        localStorage.setItem("userId", result.data.id);
        setLogin(true);
        navigate("/search");
      } catch (error) {
        // console.error("Login error:", error);
        setLogin(false);
        if (error.response) {
          // Check if the error status is 400
          if (error.response.status === 400) {
            console.log("Bad Request", error.response.data); // Log the error response
            alert(`Error: ${error.response.data.message}`); // Show error message to user
          } else {
            // Handle other status codes
            alert(`Error: ${error.response.status}`);
          }
        } else {
          // Handle network or other errors
          console.log("Error", error);
          alert("Something went wrong. Please try again later.");
        }
      }
    }
  };

  useEffect(() => {
    // Initialize the Google Sign-In button
    window.google.accounts.id.initialize({
      client_id:clientId, // Replace with your Client ID
      callback: handleCallbackGoogleResponse,
    });

    // Render the button
    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large" } // Button customization
    );
  }, []);

  const handleCallbackGoogleResponse = async (response) => {
    console.log("Encoded JWT ID token: ", response.credential);
    // Decode the JWT token or send it to your backend for verification
    const userObject = JSON.parse(atob(response.credential.split(".")[1]));

    const configuration = {
      method: "post",
      url: apiUrl + "/authentication/register",
      data: {
        email: userObject.email,
        userName: userObject.given_name,
        google_id: userObject.sub,
      },
    };
     console.log(configuration);
    await axios(configuration)
      .then((result) => {
        console.log(result.data);
        localStorage.setItem("email", result.data.user.email);
        localStorage.setItem("userName", result.data.user.userName);
        localStorage.setItem("userId", result.data.id);
       
        navigate("/search");
      })
      .catch((error) => {
        if (error.response) {
          // Check if the error status is 400
          if (error.response.status === 400) {
            console.log("Bad Request", error.response.data); // Log the error response
            alert(`Error: ${error.response.data.message}`); // Show error message to user
          } else {
            // Handle other status codes
            alert(`Error: ${error.response.status}`);
          }
        } else {
          // Handle network or other errors
          console.log("Error", error);
          alert("Something went wrong. Please try again later.");
        }
      });
  };

  const handleCallbackFacebookResponse = async (response) => {
   
    console.log(response); // Handle the response
    const username = response.name.split(" ");
    const configuration = {
      method: "post",
      url: apiUrl + "/authentication/register",
      data: {
        email: response.email,
        userName: username[0],
        facebook_id: response.id,
      },
    };

    await axios(configuration)
      .then((result) => {
         const email = result?.data?.user?.email;
    const userName = result?.data?.user?.userName;
    const userId = result?.data?.id;

    localStorage.setItem("email", email);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userId", userId);


        navigate("/search");
      })
      .catch((error) => {
        if (error.response) {
          // Check if the error status is 400
          if (error.response.status === 400) {
            console.log("Bad Request", error.response.data); // Log the error response
            alert(`Error: ${error.response.data.message}`); // Show error message to user
          } else {
            // Handle other status codes
            alert(`Error: ${error.response.status}`);
          }
        } else {
          // Handle network or other errors
          console.log("Error", error);
          alert("Something went wrong. Please try again later.");
        }
      });
  };
  const handleSendOtp = async () => {
  try {
    await axios.post(`${apiUrl}/authentication/send-otp`, {
      email: formData.username,
    });
    setOtpSent(true);
    alert("OTP sent to your email");
  } catch (err) {
    alert("Failed to send OTP");
  }
};

const handleVerifyOtp = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${apiUrl}/authentication/verify-otp`, {
      email: formData.username,
      otp,
    });

    // Log the response to inspect its structure
    console.log("OTP response:", res.data.user);

    // Save relevant user data
  
    //  if (res.data.user && res.data.user.userName) {
      localStorage.setItem("userName", res.data.user.userName);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("userId", res.data.user.$id);
    // } else {
    //   console.warn("userName not found in response");
    // }
    localStorage.setItem("token", res.data.token);
    alert("Login successful");
    navigate("/search");
  } catch (err) {
    console.log(err.response); // Inspect server response
    alert("Invalid or expired OTP");
  }
};


  return (
    <>
      <section className="innerpage-wrapper">
        <div id="login" className="innerpage-section-padding">
          <div className="container">
            <div className="row row-bg-color">
              <div className="col-md-12">
                <div className="flex-content container-bg">
                  <div className="custom-form custom-form-fields">
                    <h3>Sign In</h3>
                    <form onSubmit={otpMode ? handleVerifyOtp : handleSubmit}>
                      <div className="form-group">
                        {/* Show error above email field */}
                          {login === false && (
                            <p className="text-danger text-center font-weight-bold bg-light  rounded py-2">
                              Invalid username or password</p>
                          )}
                        <label className="custom-label">Email</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.username ? "is-invalid" : ""
                          }`}
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                        />

                        {errors.username && (
                          <div className="invalid-feedback">
                            {errors.username}
                          </div>
                        )}
                      </div>
                        {otpMode && otpSent && (
                            <div className="form-group">
                              <label className="custom-label">Enter OTP</label>
                              <input
                                type="text"
                                className="form-control"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                              />
                            </div>
                          )}

                      {/* <div className="form-group">
                        <label className="custom-label">Password</label>
                        <input
                          type={hidePassword ? "password" : "text"}
                          className={`form-control ${
                            errors.password ? "is-invalid" : ""
                          }`}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <span>
                          <a
                            className="bg-transparent text-black"
                            onClick={managePasswordVisibility}
                          >
                            <label className="hide-show-label">
                              {" "}
                              {hidePassword ? "Show" : "Hide"}
                            </label>
                          </a>
                        </span>
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password}
                          </div>
                        )}
                      </div> */}
                      {!otpMode && (
                          <div className="form-group">
                            <label className="custom-label">Password</label>
                            <input
                              type={hidePassword ? "password" : "text"}
                              className={`form-control ${errors.password ? "is-invalid" : ""}`}
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                            />
                            <span>
                              <a
                                className="bg-transparent text-black"
                                onClick={managePasswordVisibility}
                              >
                                <label className="hide-show-label">
                                  {hidePassword ? "Show" : "Hide"}
                                </label>
                              </a>
                            </span>
                            {errors.password && (
                              <div className="invalid-feedback">
                                {errors.password}
                              </div>
                            )}
                          </div>
                        )}

                      <div className="checkbox">
                        <label style={{ display: "block" }}>
                          <input type="checkbox" /> Keep me signed in
                        </label>
                        <label>
                          By signing in, I agree to the Preyana's{" "}
                          <Link to="" className="link-text">
                            Terms and Conditions{" "}
                          </Link>
                          &{" "}
                          <Link to="" className="link-text">
                            Privacy statement{" "}
                          </Link>
                          .
                        </label>
                      </div>

                          

                      {!otpMode ? (
                          < div className="text-center">
                            <button type="submit" className="btn btn-orange btn-block">
                              Login
                            </button>
                           <p className="mt-3 mb-1">
                              Or
                            </p>
                              <p>
                              <span
                                onClick={() => setOtpMode(true)}
                                className="link-text text-primary"
                                style={{ cursor: "pointer" }}
                              >
                                Login with OTP
                              </span>
                            </p>
                          </div>
                        ) : !otpSent ? (
                          <button
                            type="button"
                            className="btn btn-orange btn-block"
                            onClick={handleSendOtp}
                          >
                            Send OTP
                          </button>
                        ) : (
                          <>
                            <button type="submit" className="btn btn-orange btn-block">
                              Verify OTP
                            </button>
                            <p>
                              <span
                                onClick={() => {
                                  setOtpMode(false);
                                  setOtp("");
                                  setOtpSent(false);
                                }}
                                className="link-text"
                                style={{ cursor: "pointer" }}
                              >
                                Back to password login
                              </span>
                            </p>
                          </>
                         )}

                      {/* {login === true ? (
                        <p className="text-success">
                          You Are Logged in Successfully
                        </p>
                      ) : login === false ? (
                        <p className="text-danger">
                          Invalid username or password
                        </p>
                      ) : (
                        ""
                      )} */}
                      {login === true && (
                          <div className="alert alert-success py-2">
                            You are logged in successfully
                          </div>
                        )}
                    </form>
                    <div className="other-links">
                      <p className="link-line">
                        Don't have an account?{" "}
                        <Link className="link-text" to="/registration">
                          Create One
                        </Link>
                      </p>

                      <p
                        className="link-line"
                        style={{ display: "inline-block" }}
                      >
                        <div className="m-3">or continue with </div>
                        {/* <GoogleOAuthProvider clientId={clientId}>
                          <GoogleLogin
                            onSuccess={handleCallbackGoogleResponse}
                            onError={handleFailure}
                          />
                        </GoogleOAuthProvider> */}
                        <Link to="/login" id="googleSignInDiv">
                          <img
                            src={googleimage}
                            className="img-fluid plane_hotel_icon"
                            alt="plane-img"
                          />
                        </Link>
                        <FacebookLogin
                          appId="24280368278216336"
                          autoLoad={false}
                          fields="name,email,picture"
                          callback={handleCallbackFacebookResponse}
                          icon="fa-facebook"
                        />
                        {/* <FacebookLogin
                            appId={FACEBOOK_APP_ID}
                            fields="name,email,picture" // Request basic fields
                            callback={handleFacebookResponse} // Function called after Facebook interaction
                            onFailure={handleFailure}
                            render={renderProps => ( // Simple button rendering
                              <button onClick={renderProps.onClick} disabled={renderProps.isDisabled}>
                                Login with Facebook
                              </button>
                            )}
                        /> */}
                      </p>
                      <p className="text-rimary mt-3">
                        <Link to="/forgot">Forgot Password ?</Link>
                      </p>
                    </div>
                  </div>
                          {/* Inline style block */}
                    <style>{`
                      @keyframes slideTopToBottom {
                        from {
                          transform: translateY(-100px);
                          opacity: 0;
                        }
                        to {
                          transform: translateY(0);
                          opacity: 1;
                        }
                      }

                      .image-slide-in {
                        animation: slideTopToBottom 1s ease-out forwards;
                      }
                    `}</style>
                  <div className="flex-content-img custom-form-img">
                    <Carousel controls={false} indicators={false}>
                      <Carousel.Item>
                        <img
                          className="d-block w-100 image-slide-in"
                          style={{ height: "380px" }}
                          src={destination_3}
                          alt="First slide"
                        />
                      </Carousel.Item>
                    </Carousel>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Login;
