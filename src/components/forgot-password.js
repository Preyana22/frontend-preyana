import React, { useState, useEffect } from "react";
import sideimage from "../assets/images/registration2.jpg";

const ForgotPassword = () => {
  return (
    <>
      <section class="innerpage-wrapper">
        <div id="forgot-password" class="innerpage-section-padding">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <div class="flex-content">
                  <div class="custom-form custom-form-fields">
                    <h3>Forgot Password</h3>
                    <p>
                      When you fill in your registered email address, you will
                      be sent instructions on how to reset your password.
                    </p>
                    <form>
                      <div class="form-group">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Your Email"
                          required
                        />
                        <span>
                          <i class="fa fa-envelope"></i>
                        </span>
                      </div>

                      <button class="btn btn-orange btn-block">Send</button>
                    </form>

                    <div class="other-links">
                      <p class="link-line">
                        Already Have An Account ? <a href="/">Login Here</a>
                      </p>
                      <p class="link-line">
                        New Here ? <a href="/registration">Join Us</a>
                      </p>
                    </div>
                  </div>

                  <div class="flex-content-img custom-form-img">
                    <img
                      src={sideimage}
                      class="img-fluid"
                      alt="registration-img"
                    />
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

export default ForgotPassword;
