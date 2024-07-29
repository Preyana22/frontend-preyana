import React, { useState, useEffect } from "react";
import sideimage from "../assets/images/registration2.jpg";

const ChangePassword = () => {
  return (
    <>
      <section class="innerpage-wrapper">
        <div id="forgot-password" class="innerpage-section-padding">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <div class="flex-content">
                  <div class="custom-form custom-form-fields">
                    <h3>Change Password</h3>
                    <form>
                      <div class="form-group">
                        <input
                          type="password"
                          className={`form-control`}
                          placeholder="Password"
                          name="password"
                        />
                        <span>
                          <i className="fa fa-lock"></i>
                        </span>
                      </div>
                      <div class="form-group">
                        <input
                          type="password"
                          className={`form-control`}
                          placeholder="New Password"
                          name="newpassword"
                        />
                        <span>
                          <i className="fa fa-lock"></i>
                        </span>
                      </div>
                      <div class="form-group">
                        <input
                          type="password"
                          className={`form-control`}
                          placeholder="Confirm Password"
                          name="confirmpassword"
                        />
                        <span>
                          <i className="fa fa-lock"></i>
                        </span>
                      </div>
                      <button class="btn btn-orange btn-block">Send</button>
                    </form>
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

export default ChangePassword;
