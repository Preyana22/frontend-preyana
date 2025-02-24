import React, { useState } from "react";
import sideimage from "../assets/images/registration2.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate form fields
    if (!newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New Password and Confirm Password do not match.");
      return;
    }

    try {
      // Send request to reset password API
      const token = new URLSearchParams(window.location.search).get("token");
      const response = await axios.post(
        apiUrl + "/authentication/reset-password",
        {
          token,
          newPassword,
          confirmPassword,
        }
      );
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password.");
    }
  };

  return (
    <section className="innerpage-wrapper">
      <div id="forgot-password" className="innerpage-section-padding">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="flex-content">
                <div className="custom-form custom-form-fields">
                  <h3>Reset Password</h3>
                  <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {successMessage && (
                      <div className="alert alert-success">
                        {successMessage}
                      </div>
                    )}

                    <div className="form-group">
                      <label className="custom-label">New Password</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="custom-label">Confirm Password</label>
                      <input
                        type="text"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn btn-orange btn-block">
                      Send
                    </button>
                  </form>
                </div>
                <div className="flex-content-img custom-form-img">
                  <img
                    src={sideimage}
                    className="img-fluid"
                    alt="registration-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
