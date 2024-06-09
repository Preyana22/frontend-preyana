import React, { useState } from 'react';
import Header from '../Layout/Header'; // Import the Header component
import Footer from '../Layout/Footer';
import axios from 'axios';
//import sideimage from './images/registration.jpg';

const Registration = (props) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      const [errors, setErrors] = useState({});
      const [register, setRegister] = useState(false);
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' }); // Clear validation errors when input changes
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate form data
        const newErrors = {};
        if (formData.username.trim() === '') {
          newErrors.username = 'Username is required';
        }
        if (formData.email.trim() === '') {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        if (formData.password.trim() === '') {
          newErrors.password = 'Password is required';
        }
        if (formData.confirmPassword.trim() === '') {
          newErrors.confirmPassword = 'Confirm Password is required';
        } else if (formData.confirmPassword !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
    
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
        } else {
          // Form is valid, submit the data or perform other actions
          console.log('Form data:', formData);
const payload={ 
    "email":formData.email,
    "userName":formData.username,
    "password":formData.password


}
const configuration = {
    method: "post",
    url: "http://54.242.232.154:3000/authentication/register",
    data: {
        "email":formData.email,
        "userName":formData.username,
        "password":formData.password
    },
  };
await axios(configuration)
  .then((result) => {
    console.log("response",result.data);
    setRegister(true);
  })
  .catch((error) => {
    error = new Error();
  });
//const response = await axios.post('http://localhost:3000/authentication/register', payload);

//this.setState(response.data);
/*f(response.status==201)
{
    localStorage.setItem("token",response.data.token);
    window.location="/dashboard"
    }else{
        alert("Error in registration")
        }
        setIsSubmitting(false);
        };
    .then(response => this.setState({ articleId: response.data.id }));*/
     
        }
      };
  return (
    <>
    <Header/>
        
    <section className="page-cover" id="cover-registration">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="page-title">Registration 1</h1>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/home">Home</a></li>
                            <li className="breadcrumb-item">Registration 1</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        
        
        <section className="innerpage-wrapper">
            <div id="registration" className="innerpage-section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                        
                            <div className="flex-content">
                                <div className="custom-form custom-form-fields">
                                    <h3>Registration</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                    <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                        placeholder="Username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        
                                    />
                                    <span><i className="fa fa-user"></i></span>
                                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                    </div>
        
                                    <div className="form-group">
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            
          />
          <span><i className="fa fa-envelope"></i></span>
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="form-group">
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            
          />
          <span><i className="fa fa-lock"></i></span>
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <div className="form-group">
          <input
            type="password"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            
          />
          <span><i className="fa fa-lock"></i></span>
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>
                                        <button className="btn btn-orange btn-block">Register</button>
                                    </form>
                                    
                                    <div className="other-links">
                                        <p className="link-line">Already Have An Account ? <a href="/">Login Here</a></p>
                                    </div>
                                </div>
                                
                                <div className="flex-content-img custom-form-img">
                                  {/*<img src={sideimage} className="img-fluid" alt="registration-img" />*/}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>        
            </div>
        </section>
        
        
        <section id="best-features" className="banner-padding black-features">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-lg-3">
                        <div className="b-feature-block">
                            <span><i className="fa fa-dollar"></i></span>
                            <h3>Best Price Guarantee</h3>
                            <p>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius prodesset pri. Veniam delectus ei vis.</p>
                        </div>
                   </div>
                   
                   <div className="col-md-6 col-lg-3">
                        <div className="b-feature-block">
                            <span><i className="fa fa-lock"></i></span>
                            <h3>Safe and Secure</h3>
                            <p>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius prodesset pri. Veniam delectus ei vis.</p>
                        </div>
                   </div>
                   
                   <div className="col-md-6 col-lg-3">
                        <div className="b-feature-block">
                            <span><i className="fa fa-thumbs-up"></i></span>
                            <h3>Best Travel Agents</h3>
                            <p>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius prodesset pri. Veniam delectus ei vis.</p>
                        </div>
                   </div>
                   
                   <div className="col-md-6 col-lg-3">
                        <div className="b-feature-block">
                            <span><i className="fa fa-bars"></i></span>
                            <h3>Travel Guidelines</h3>
                            <p>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius prodesset pri. Veniam delectus ei vis.</p>
                        </div>
                   </div>
                </div>
            </div>
        </section>
        
        
        <section id="newsletter-1" className="section-padding back-size newsletter"> 
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-12 col-xl-12 text-center">
                        <h2>Subscribe Our Newsletter</h2>
                        <p>Subscibe to receive our interesting updates</p>    
                        <form>
                            <div className="form-group">
                                <div className="input-group">
                                    <input type="email" className="form-control input-lg" placeholder="Enter your email address" required/>
                                    <span className="input-group-btn"><button className="btn btn-lg"><i className="fa fa-envelope"></i></button></span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
     <Footer />
        </>
  )
}
export default Registration;
