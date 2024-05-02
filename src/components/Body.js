import React from 'react';
import { useEffect, useState } from 'react';
import searchForm from '../container/search-form/search-form';
import { Typeahead } from 'react-bootstrap-typeahead'; 
import Form from 'react-bootstrap/Form';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { connect } from 'react-redux';
import { findFlights, fetchFlights } from '../actions';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import './body.css';

import axios from 'axios';


const isDate = (date) => {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
  }
  
  const ErrorLabel = (props) => {
    return (<label style={{color: 'red'}}>{props.message}</label>)
  }
export const Body =  (props) => {
    const [airportsData, setAirports] = useState([]);
    const [openOptions, setOpenOptions] = useState(false);
const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    infant: 1,
  });
  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  useEffect(() => {
    const getAirports = async () => {
      try {
       
        const { data } = await axios.get(
          `http://localhost:3000/airlines/airports`
        );
        console.log(data);
        setAirports(data);
       // setAirports(data.results);
      } catch (error) {
        console.log(error);
      } 
    };
    getAirports();
  }, []);
  
  //console.log("airportsData.results"+airportsData.data);
 // var result1 =airportsData;
  var result1 =airportsData.data;     
     
  var data1 =[];
   
   if(result1){
data1 = result1.map(t=>t.city_name==null?'abc':t.city_name+"("+ t.iata_code+"-"+t.name+")");
//data1 = result1.map(t=>t.IATAcode==null?'abc':t.IATAcode); 

    

   }

  

   const dummyairports = [
    'LHR',
    'CDG',
    'BCN',
    'LAX',
    'MEL',
    'SYD',
    'AKL',
    'DEL',
    'SIN',
    'HKG'
   
  ];
   const airports = data1? dummyairports:dummyairports;
   console.log('airports'+airports);
    const navigate = useNavigate();
    let origin, destination, cabinclass;
    let criteria
   
  
    const [isReturn, setFlightType] = useState(false);
    const [status, setFormValid] = useState({ isValid: false });
    console.log(status);
    let invalidFields = {};
    const handleSubmit1 = (event) => {
 let cabinValue;
        console.log(cabinclass.state.text);
        if(cabinclass.state.text == 'Premium Economy')
        {
            cabinValue = 'premium_economy';
        }
        else{
            cabinValue= cabinclass.state.text;
        }
        console.log(isReturn)
        event.preventDefault();
        const {flights} = props;
        invalidFields = {};
let Adults =[];
        let adultsData = {
      "type": "adult"
    }
    let childData = {
        "type": "child"
      }

    let infantData = {
        "type": "infant_without_seat"
    }
console.log(options);
console.log(options.adult);
for(var i =1; i<=options.adult; i++){
  console.log(adultsData);
    Adults.push(adultsData);
}
for(var i =1; i<=options.children; i++){
    console.log(childData);
      Adults.push(childData);
  }
  for(var i =1; i<=options.infant; i++){
    console.log(infantData);
      Adults.push(infantData);
  }
console.log(Adults);
console.log("origin.state.text"+origin.state.text);
const origin_city=origin.state.text;

const destination_city=destination.state.text;


        if(isReturn === false){
 criteria = {
        origin: origin_city,
        destination: destination_city,
        departureDate: event.target.dateOfDep.value,
      
        //numOfPassengers: event.target.passengers.value,
        numOfPassengers: Adults,
        cabin_class:cabinValue
      }
    }
    else{
         criteria = {
        origin: origin_city,
        destination: destination_city,
        departureDate: event.target.dateOfDep.value,
       returnDate:event.target.returnDate.value,
        //numOfPassengers: event.target.passengers.value,
        numOfPassengers: Adults,
        cabin_class:cabinValue
        }
    }
  console.log(criteria);
    
  
   
      if (!cabin_details.includes(cabinclass.state.text)) {
        invalidFields.cabinclass = true;
      }
     
      if(!isDate(criteria.departureDate)) {
        invalidFields.departureDate = true;
      }
      if(!isDate(criteria.departureDate)) {
        invalidFields.departureDate = true;
      }
      if(Object.keys(invalidFields).length > 0) {
        setFormValid({isValid: false, ...invalidFields});
        return;
      }
      
      setFormValid({isValid: true});

      props.findFlights({flights, criteria});
     
      navigate('/results');
    }
    const handleSubmit = (event) => {
 
        event.preventDefault();
        const {flights} = props;
        invalidFields = {};
       
        if(isReturn === false){
 criteria = {
        origin: origin.state.text,
        destination: destination.state.text,
        departureDate: event.target.dateOfDep.value,
      
        numOfPassengers: event.target.numOfPassengers.value,
        cabin_class:cabinclass.state.text
      }
    }
    else{
         criteria = {
        origin: origin.state.text,
        destination: destination.state.text,
        departureDate: event.target.dateOfDep.value,
       returnDate:event.target.dateOfReturn.value,
        numOfPassengers: event.target.numOfPassengers.value,
        cabin_class:cabinclass.state.text
        }
    }
  console.log(criteria);
     /* if (event.target.flightType[1].checked ) {
        criteria.returnDate = event.target.dateOfReturn.value;
        if (!isDate(event.target.dateOfReturn.value)) {
          invalidFields.returnDate = true;
        }
      }*/
  
      if (!airports.includes(criteria.origin)) {
        invalidFields.origin = true;
      }
      if (!airports.includes(criteria.destination) || criteria.origin === criteria.destination) {
        invalidFields.destination = true;
      }
      if(!isDate(criteria.departureDate)) {
        invalidFields.departureDate = true;
      }
      if(!isDate(criteria.departureDate)) {
        invalidFields.departureDate = true;
      }
      if(Object.keys(invalidFields).length > 0) {
        setFormValid({isValid: false, ...invalidFields});
        return;
      }
      
      setFormValid({isValid: true});
      props.findFlights({flights, criteria});
     
      navigate('/results');
    }
    const mystyle = {
        background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)) 0% 0% / cover, url(../assets/images/homepage-slider.jpg) 50% 0%',
        height: '100%',
        width: '1510px',
        marginRight: '0px',
        float: 'left',
        display: 'block',
        
       
      };


   
        
       
      
    /* const airports = [
        'LHR',
        'CDG',
        'BCN',
        'LAX',
        'MEL',
        'SYD',
        'AKL',
        'DEL',
        'SIN',
        'HKG'
       
      ];*/

      const cabin_details = [
        'Economy',
        'Premium Economy',
        'Business',
        'First'
      
      ];
     
    return(
        <div>
   <body id="main-homepage">

<div className="wrapper">

  


   
    <div id="myOverlay" className="overlay">
        <span className="closebtn" onClick="closeSearch()" title="Close Overlay">×</span>
        <div className="overlay-content">

            <form>
                <div className="form-group">
                    <div className="input-group">
                        <input className="float-left" type="text" placeholder="Search.." name="search"/>
                        <button className="float-left" type="submit"><i className="fa fa-search"></i></button>
                    </div>
                </div>
            </form>

        </div>
    </div>



    <div id="top-bar" className="tb-text-white">
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-6">
                    <div id="info">
                        <ul className="list-unstyled list-inline">
                            <li className="list-inline-item"><span><i className="fa fa-map-marker"></i></span>29 Land St,
                                Lorem City, CA</li>
                            <li className="list-inline-item"><span><i className="fa fa-phone"></i></span>+00 123 4567</li>
                        </ul>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div id="links">
                        <ul className="list-unstyled list-inline">
                            <li className="list-inline-item"><a href="login-1.html"><span><i
                                            className="fa fa-lock"></i></span>Login</a></li>
                            <li className="list-inline-item"><a href="registration-1.html"><span><i
                                            className="fa fa-plus"></i></span>Sign Up</a></li>
                            <li className="list-inline-item">
                                <form>
                                    <ul className="list-inline">
                                        <li className="list-inline-item">
                                            <div className="form-group currency">
                                                <span><i className="fa fa-angle-down"></i></span>
                                                <select className="form-control">
                                                    <option value="">$</option>
                                                    <option value="">£</option>
                                                </select>
                                            </div>
                                        </li>
                                        <li className="list-inline-item">
                                            <div className="form-group language">
                                                <span><i className="fa fa-angle-down"></i></span>
                                                <select className="form-control">
                                                    <option value="">EN</option>
                                                    <option value="">UR</option>
                                                    <option value="">FR</option>
                                                    <option value="">IT</option>
                                                </select>
                                            </div>
                                        </li>
                                    </ul>
                                </form>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <nav className="navbar navbar-expand-xl navbar-custom main-navbar p-1" id="mynavbar-1">
        <div className="container">

            <a href="#" className="navbar-brand py-1 m-0"><span><i className="fa fa-plane"></i>STAR</span>TRAVELS</a>
            <div className="header-search d-xl-none my-auto ms-auto py-1">
                <a href="#" className="search-button" onClick="openSearch()"><span><i
                            className="fa fa-search"></i></span></a>
            </div>
            <button className="navbar-toggler ms-2" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation" id="sidebarCollapse">
                <i className="fa fa-navicon py-1"></i>
            </button>

            <div className="collapse navbar-collapse" id="myNavbar1">
                <ul className="navbar-nav ms-auto navbar-search-link">
                    <li className="nav-item dropdown active">
                        <a href="#" className="nav-link" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">Home<span><i
                                    className="fa fa-angle-down "></i></span></a>
                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li className="active"><a href="index.html" className="dropdown-item">Main Homepage</a></li>
                            <li><a className="dropdown-item" href="flight-homepage.html">Flight Homepage</a></li>
                            <li><a className="dropdown-item" href="hotel-homepage.html">Hotel Homepage</a></li>
                            <li><a className="dropdown-item" href="tour-homepage.html">Tour Homepage</a></li>
                            <li><a className="dropdown-item" href="cruise-homepage.html">Cruise Homepage</a></li>
                            <li><a className="dropdown-item" href="car-homepage.html">Car Homepage</a></li>
                            <li><a className="dropdown-item" href="landing-page.html">Landing Page</a></li>
                            <li><a className="dropdown-item" href="travel-agency-homepage.html">Travel Agency Page</a>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        <a href="#" className="nav-link" data-bs-toggle="dropdown">Flight<span><i
                                    className="fa fa-angle-down"></i></span></a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="flight-homepage.html">Flight Homepage</a></li>
                            <li><a className="dropdown-item" href="flight-listing-left-sidebar.html">List View Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="flight-listing-right-sidebar.html">List View Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="flight-grid-left-sidebar.html">Grid View Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="flight-grid-right-sidebar.html">Grid View Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="flight-detail-left-sidebar.html">Detail Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="flight-detail-right-sidebar.html">Detail Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="flight-booking-left-sidebar.html">Booking Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="flight-booking-right-sidebar.html">Booking Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="flight-search-result.html">Search Result</a></li>
                            <li><a className="dropdown-item" href="flight-offers.html">Hot Offers</a></li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        <a href="#" className="nav-link" data-bs-toggle="dropdown">Hotel<span><i
                                    className="fa fa-angle-down"></i></span></a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="hotel-homepage.html">Hotel Homepage</a></li>
                            <li><a className="dropdown-item" href="hotel-listing-left-sidebar.html">List View Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="hotel-listing-right-sidebar.html">List View Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="hotel-grid-left-sidebar.html">Grid View Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="hotel-grid-right-sidebar.html">Grid View Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="hotel-detail-left-sidebar.html">Detail Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="hotel-detail-right-sidebar.html">Detail Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="hotel-booking-left-sidebar.html">Booking Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="hotel-booking-right-sidebar.html">Booking Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="hotel-search-result.html">Search Result</a></li>
                            <li><a className="dropdown-item" href="hotel-offers.html">Hot Offers</a></li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        <a href="#" className="nav-link" data-bs-toggle="dropdown">Tour<span><i
                                    className="fa fa-angle-down"></i></span></a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="tour-homepage.html">Tour Homepage</a></li>
                            <li><a className="dropdown-item" href="tour-listing-left-sidebar.html">List View Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="tour-listing-right-sidebar.html">List View Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="tour-grid-left-sidebar.html">Grid View Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="tour-grid-right-sidebar.html">Grid View Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="tour-detail-left-sidebar.html">Detail Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="tour-detail-right-sidebar.html">Detail Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="tour-booking-left-sidebar.html">Booking Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="tour-booking-right-sidebar.html">Booking Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="tour-search-result.html">Search Result</a></li>
                            <li><a className="dropdown-item" href="tour-offers.html">Hot Offers</a></li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        <a href="#" className="nav-link" data-bs-toggle="dropdown">Cruise<span><i
                                    className="fa fa-angle-down"></i></span></a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="cruise-homepage.html">Cruise Homepage</a></li>
                            <li><a className="dropdown-item" href="cruise-listing-left-sidebar.html">List View Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="cruise-listing-right-sidebar.html">List View Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="cruise-grid-left-sidebar.html">Grid View Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="cruise-grid-right-sidebar.html">Grid View Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="cruise-detail-left-sidebar.html">Detail Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="cruise-detail-right-sidebar.html">Detail Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="cruise-booking-left-sidebar.html">Booking Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="cruise-booking-right-sidebar.html">Booking Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="cruise-search-result.html">Search Result</a></li>
                            <li><a className="dropdown-item" href="cruise-offers.html">Hot Offers</a></li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        <a href="#" className="nav-link" data-bs-toggle="dropdown">Car<span><i
                                    className="fa fa-angle-down"></i></span></a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="car-homepage.html">Car Homepage</a></li>
                            <li><a className="dropdown-item" href="car-listing-left-sidebar.html">List View Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="car-listing-right-sidebar.html">List View Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="car-grid-left-sidebar.html">Grid View Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="car-grid-right-sidebar.html">Grid View Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="car-detail-left-sidebar.html">Detail Left Sidebar</a>
                            </li>
                            <li><a className="dropdown-item" href="car-detail-right-sidebar.html">Detail Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="car-booking-left-sidebar.html">Booking Left
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="car-booking-right-sidebar.html">Booking Right
                                    Sidebar</a></li>
                            <li><a className="dropdown-item" href="car-search-result.html">Search Result</a></li>
                            <li><a className="dropdown-item" href="car-offers.html">Hot Offers</a></li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">Features<span><i
                                    className="fa fa-angle-down"></i></span></a>
                        <ul className="dropdown-menu">
                            <li className="dropdown-submenu"><a href="#" className="dropdown-toggle dropdown-item"
                                    data-bs-toggle="dropdown">Header</a>
                                <ul className="dropdown-menu dropdown-sbm left-sbm">
                                    <li><a href="feature-header-style-1.html" className="dropdown-item">Header Style
                                            1</a></li>
                                    <li><a href="feature-header-style-2.html" className="dropdown-item">Header Style
                                            2</a></li>
                                    <li><a href="feature-header-style-3.html" className="dropdown-item">Header Style
                                            3</a></li>
                                    <li><a href="feature-header-style-4.html" className="dropdown-item">Header Style
                                            4</a></li>
                                    <li><a href="feature-header-style-5.html" className="dropdown-item">Header Style
                                            5</a></li>
                                    <li><a href="feature-header-style-6.html" className="dropdown-item">Header Style
                                            6</a></li>
                                </ul>
                            </li>
                            <li className="dropdown-submenu"><a href="#" className="dropdown-toggle dropdown-item"
                                    data-bs-toggle="dropdown">Page Title</a>
                                <ul className="dropdown-menu dropdown-sbm left-sbm">
                                    <li><a href="feature-page-title-style-1.html" className="dropdown-item">Page Title
                                            Style 1</a></li>
                                    <li><a href="feature-page-title-style-2.html" className="dropdown-item">Page Title
                                            Style 2</a></li>
                                    <li><a href="feature-page-title-style-3.html" className="dropdown-item">Page Title
                                            Style 3</a></li>
                                    <li><a href="feature-page-title-style-4.html" className="dropdown-item">Page Title
                                            Style 4</a></li>
                                    <li><a href="feature-page-title-style-5.html" className="dropdown-item">Page Title
                                            Style 5</a></li>
                                    <li><a href="feature-page-title-style-6.html" className="dropdown-item">Page Title
                                            Style 6</a></li>
                                </ul>
                            </li>
                            <li className="dropdown dropdown-submenu"><a href="#" className="dropdown-toggle dropdown-item"
                                    data-bs-toggle="dropdown">Footer</a>
                                <ul className="dropdown-menu dropdown-sbm left-sbm">
                                    <li><a href="feature-footer-style-1.html" className="dropdown-item">Footer Style
                                            1</a></li>
                                    <li><a href="feature-footer-style-2.html" className="dropdown-item">Footer Style
                                            2</a></li>
                                    <li><a href="feature-footer-style-3.html" className="dropdown-item">Footer Style
                                            3</a></li>
                                    <li><a href="feature-footer-style-4.html" className="dropdown-item">Footer Style
                                            4</a></li>
                                    <li><a href="feature-footer-style-5.html" className="dropdown-item">Footer Style
                                            5</a></li>
                                </ul>
                            </li>
                            <li className="dropdown dropdown-submenu"><a href="#" className="dropdown-toggle dropdown-item"
                                    data-bs-toggle="dropdown">Blog</a>
                                <ul className="dropdown-menu dropdown-sbm left-sbm">
                                    <li><a href="blog-listing-left-sidebar.html" className="dropdown-item">Blog Listing
                                            Left Sidebar</a></li>
                                    <li><a href="blog-listing-right-sidebar.html" className="dropdown-item">Blog Listing
                                            Right Sidebar</a></li>
                                    <li><a href="blog-detail-left-sidebar.html" className="dropdown-item">Blog Detail
                                            Left Sidebar</a></li>
                                    <li><a href="blog-detail-right-sidebar.html" className="dropdown-item">Blog Detail
                                            Right Sidebar</a></li>
                                </ul>
                            </li>
                            <li className="dropdown dropdown-submenu"><a href="#" className="dropdown-toggle dropdown-item"
                                    data-bs-toggle="dropdown">Gallery</a>
                                <ul className="dropdown-menu dropdown-sbm left-sbm">
                                    <li><a href="gallery-masonry.html" className="dropdown-item">Gallery Masonry</a>
                                    </li>
                                    <li><a href="gallery-2-columns.html" className="dropdown-item">Gallery 2 Columns</a>
                                    </li>
                                    <li><a href="gallery-3-columns.html" className="dropdown-item">Gallery 3 Columns</a>
                                    </li>
                                    <li><a href="gallery-4-columns.html" className="dropdown-item">Gallery 4 Columns</a>
                                    </li>
                                </ul>
                            </li>
                            <li className="dropdown dropdown-submenu"><a href="#" className="dropdown-toggle dropdown-item"
                                    data-bs-toggle="dropdown">Forms</a>
                                <ul className="dropdown-menu dropdown-sbm left-sbm">
                                    <li><a href="login-1.html" className="dropdown-item">Login 1</a></li>
                                    <li><a href="login-2.html" className="dropdown-item">Login 2</a></li>
                                    <li><a href="registration-1.html" className="dropdown-item">Registration 1</a></li>
                                    <li><a href="registration-2.html" className="dropdown-item">Registration 2</a></li>
                                    <li><a href="forgot-password-1.html" className="dropdown-item">Forgot Password 1</a>
                                    </li>
                                    <li><a href="forgot-password-2.html" className="dropdown-item">Forgot Password 2</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        <a href="#" className="nav-link" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">Pages<span><i
                                    className="fa fa-angle-down"></i></span></a>
                        <ul className="dropdown-menu dropdown-menu-left row mega-dropdown-menu"
                            aria-labelledby="navbarDropdown">
                            <li className="dropdown-item">
                                <div className="row">
                                    <div className="col-md">
                                        <ul className="list-unstyled">
                                            <li className="dropdown-item dropdown-header">Standard <span>Pages</span>
                                            </li>
                                            <li><a href="about-us-1.html">About Us 1</a></li>
                                            <li><a href="about-us-2.html">About Us 2</a></li>
                                            <li><a href="services-1.html">Services 1</a></li>
                                            <li><a href="services-2.html">Services 2</a></li>
                                            <li><a href="team-1.html">Our Team 1</a></li>
                                            <li><a href="team-2.html">Our Team 2</a></li>
                                            <li><a href="contact-us-1.html">Contact Us 1</a></li>
                                            <li><a href="contact-us-2.html">Contact Us 2</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-md">
                                        <ul className="list-unstyled">
                                            <li className=" dropdown-header">User <span>Dashboard</span></li>
                                            <li><a href="dashboard-1.html">Dashboard 1</a></li>
                                            <li><a href="dashboard-2.html">Dashboard 2</a></li>
                                            <li><a href="user-profile.html">User Profile</a></li>
                                            <li><a href="booking.html">Booking</a></li>
                                            <li><a href="wishlist.html">Wishlist</a></li>
                                            <li><a href="cards.html">Cards</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-md">
                                        <ul className="list-unstyled">
                                            <li className=" dropdown-header">Special <span>Pages</span></li>
                                            <li><a href="error-page-1.html">404 Page 1</a></li>
                                            <li><a href="error-page-2.html">404 Page 2</a></li>
                                            <li><a href="coming-soon-1.html">Coming Soon 1</a></li>
                                            <li><a href="coming-soon-2.html">Coming Soon 2</a></li>
                                            <li><a href="faq-left-sidebar.html">FAQ Left Sidebar</a></li>
                                            <li><a href="faq-right-sidebar.html">FAQ Right Sidebar</a></li>
                                            <li><a href="testimonials-1.html">Testimonials 1</a></li>
                                            <li><a href="testimonials-2.html">Testimonials 2</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-md">
                                        <ul className="list-unstyled">
                                            <li className=" dropdown-header">Extra <span>Pages</span></li>
                                            <li><a href="before-you-fly.html">Before Fly</a></li>
                                            <li><a href="travel-insurance.html">Travel Insurance</a></li>
                                            <li><a href="travel-guide.html">Travel Guide</a></li>
                                            <li><a href="holidays.html">Holidays</a></li>
                                            <li><a href="thank-you.html">Thank You</a></li>
                                            <li><a href="payment-success.html">Payment Success</a></li>
                                            <li><a href="pricing-table-1.html">Pricing Table 1</a></li>
                                            <li><a href="pricing-table-2.html">Pricing Table 2</a></li>
                                            <li><a href="popup-ad.html">Popup Ad</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li className="dropdown-item search-btn">
                        <a href="#" className="search-button" onClick="openSearch()"><span><i
                                    className="fa fa-search"></i></span></a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div className="sidenav-content">
        
        <nav id="sidebar" className="sidenav">
            <h2 id="web-name"><span><i className="fa fa-plane"></i></span>Preyana</h2>

            <div id="main-menu">
                <div id="dismiss">
                    <button className="btn" id="closebtn">&times;</button>
                </div>
                <div className="list-group panel">
                    <a href="#home-links" className="items-list active" data-bs-toggle="collapse" aria-expanded="false">
                        <span><i className="fa fa-home link-icon"></i></span>Home<span><i
                                className="fa fa-chevron-down arrow"></i></span></a>
                    <div className="collapse sub-menu text-danger" id="home-links">
                        <a className="items-list active" href="index.html">Main Homepage</a>
                        <a className="items-list" href="flight-homepage.html">Flight Homepage</a>
                        <a className="items-list" href="hotel-homepage.html">Hotel Homepage</a>
                        <a className="items-list" href="tour-homepage.html">Tour Homepage</a>
                        <a className="items-list" href="cruise-homepage.html">Cruise Homepage</a>
                        <a className="items-list" href="car-homepage.html">Car Homepage</a>
                        <a className="items-list" href="landing-page.html">Landing Page</a>
                        <a className="items-list" href="travel-agency-homepage.html">Travel Agency Page</a>
                    </div>

                    <a className="items-list" href="#flights-links" data-bs-toggle="collapse"><span><i
                                className="fa fa-plane link-icon"></i></span>Flights<span><i
                                className="fa fa-chevron-down arrow"></i></span></a>
                    <div className="collapse sub-menu" id="flights-links">
                        <a className="items-list" href="flight-homepage.html">Flight Homepage</a>
                        <a className="items-list" href="flight-listing-left-sidebar.html">List View Left Sidebar</a>
                        <a className="items-list" href="flight-listing-right-sidebar.html">List View Right Sidebar</a>
                        <a className="items-list" href="flight-grid-left-sidebar.html">Grid View Left Sidebar</a>
                        <a className="items-list" href="flight-grid-right-sidebar.html">Grid View Right Sidebar</a>
                        <a className="items-list" href="flight-detail-left-sidebar.html">Detail Left Sidebar</a>
                        <a className="items-list" href="flight-detail-right-sidebar.html">Detail Right Sidebar</a>
                        <a className="items-list" href="flight-booking-left-sidebar.html">Booking Left Sidebar</a>
                        <a className="items-list" href="flight-booking-right-sidebar.html">Booking Right Sidebar</a>
                        <a className="items-list" href="flight-search-result.html">Search Result</a>
                        <a className="items-list" href="flight-offers.html">Hot Offers</a>
                    </div>

                    <a className="items-list" href="#hotels-links" data-bs-toggle="collapse"><span><i
                                className="fa fa-building link-icon"></i></span>Hotels<span><i
                                className="fa fa-chevron-down arrow"></i></span></a>
                    <div className="collapse sub-menu" id="hotels-links">
                        <a className="items-list" href="hotel-homepage.html">Hotel Homepage</a>
                        <a className="items-list" href="hotel-listing-left-sidebar.html">List View Left Sidebar</a>
                        <a className="items-list" href="hotel-listing-right-sidebar.html">List View Right Sidebar</a>
                        <a className="items-list" href="hotel-grid-left-sidebar.html">Grid View Left Sidebar</a>
                        <a className="items-list" href="hotel-grid-right-sidebar.html">Grid View Right Sidebar</a>
                        <a className="items-list" href="hotel-detail-left-sidebar.html">Detail Left Sidebar</a>
                        <a className="items-list" href="hotel-detail-right-sidebar.html">Detail Right Sidebar</a>
                        <a className="items-list" href="hotel-booking-left-sidebar.html">Booking Left Sidebar</a>
                        <a className="items-list" href="hotel-booking-right-sidebar.html">Booking Right Sidebar</a>
                        <a className="items-list" href="hotel-search-result.html">Search Result</a>
                        <a className="items-list" href="hotel-offers.html">Hot Offers</a>
                    </div>

                    <a className="items-list" href="#tours-links" data-bs-toggle="collapse"><span><i
                                className="fa fa-globe link-icon"></i></span>Tours<span><i
                                className="fa fa-chevron-down arrow"></i></span></a>
                    <div className="collapse sub-menu" id="tours-links">
                        <a className="items-list" href="tour-homepage.html">Tour Homepage</a>
                        <a className="items-list" href="tour-listing-left-sidebar.html">List View Left Sidebar</a>
                        <a className="items-list" href="tour-listing-right-sidebar.html">List View Right Sidebar</a>
                        <a className="items-list" href="tour-grid-left-sidebar.html">Grid View Left Sidebar</a>
                        <a className="items-list" href="tour-grid-right-sidebar.html">Grid View Right Sidebar</a>
                        <a className="items-list" href="tour-detail-left-sidebar.html">Detail Left Sidebar</a>
                        <a className="items-list" href="tour-detail-right-sidebar.html">Detail Right Sidebar</a>
                        <a className="items-list" href="tour-booking-left-sidebar.html">Booking Left Sidebar</a>
                        <a className="items-list" href="tour-booking-right-sidebar.html">Booking Right Sidebar</a>
                        <a className="items-list" href="tour-search-result.html">Search Result</a>
                        <a className="items-list" href="tour-offers.html">Hot Offers</a>
                    </div>

                    <a className="items-list" href="#cruise-links" data-bs-toggle="collapse"><span><i
                                className="fa fa-ship link-icon"></i></span>Cruise<span><i
                                className="fa fa-chevron-down arrow"></i></span></a>
                    <div className="collapse sub-menu" id="cruise-links">
                        <a className="items-list" href="cruise-homepage.html">Cruise Homepage</a>
                        <a className="items-list" href="cruise-listing-left-sidebar.html">List View Left Sidebar</a>
                        <a className="items-list" href="cruise-listing-right-sidebar.html">List View Right Sidebar</a>
                        <a className="items-list" href="cruise-grid-left-sidebar.html">Grid View Left Sidebar</a>
                        <a className="items-list" href="cruise-grid-right-sidebar.html">Grid View Right Sidebar</a>
                        <a className="items-list" href="cruise-detail-left-sidebar.html">Detail Left Sidebar</a>
                        <a className="items-list" href="cruise-detail-right-sidebar.html">Detail Right Sidebar</a>
                        <a className="items-list" href="cruise-booking-left-sidebar.html">Booking Left Sidebar</a>
                        <a className="items-list" href="cruise-booking-right-sidebar.html">Booking Right Sidebar</a>
                        <a className="items-list" href="cruise-search-result.html">Search Result</a>
                        <a className="items-list" href="cruise-offers.html">Hot Offers</a>
                    </div>

                    <a className="items-list" href="#cars-links" data-bs-toggle="collapse"><span><i
                                className="fa fa-car link-icon"></i></span>Cars<span><i
                                className="fa fa-chevron-down arrow"></i></span></a>
                    <div className="collapse sub-menu" id="cars-links">
                        <a className="items-list" href="car-homepage.html">Car Homepage</a>
                        <a className="items-list" href="car-listing-left-sidebar.html">List View Left Sidebar</a>
                        <a className="items-list" href="car-listing-right-sidebar.html">List View Right Sidebar</a>
                        <a className="items-list" href="car-grid-left-sidebar.html">Grid View Left Sidebar</a>
                        <a className="items-list" href="car-grid-right-sidebar.html">Grid View Right Sidebar</a>
                        <a className="items-list" href="car-detail-left-sidebar.html">Detail Left Sidebar</a>
                        <a className="items-list" href="car-detail-right-sidebar.html">Detail Right Sidebar</a>
                        <a className="items-list" href="car-booking-left-sidebar.html">Booking Left Sidebar</a>
                        <a className="items-list" href="car-booking-right-sidebar.html">Booking Right Sidebar</a>
                        <a className="items-list" href="car-search-result.html">Search Result</a>
                        <a className="items-list" href="car-offers.html">Hot Offers</a>
                    </div>

                    <a className="items-list" href="#features-links" data-bs-toggle="collapse"><span><i
                                className="fa fa-puzzle-piece link-icon"></i></span>Features<span><i
                                className="fa fa-chevron-down arrow"></i></span></a>
                    <div className="collapse sub-menu mega-sub-menu" id="features-links">
                        <a className="items-list" href="#header-style-links" data-bs-toggle="collapse">Header<span><i
                                    className="fa fa-caret-down arrow"></i></span></a>
                        <div className="collapse sub-menu mega-sub-menu-links" id="header-style-links">
                            <a className="items-list" href="feature-header-style-1.html">Header Style 1</a>
                            <a className="items-list" href="feature-header-style-2.html">Header Style 2</a>
                            <a className="items-list" href="feature-header-style-3.html">Header Style 3</a>
                            <a className="items-list" href="feature-header-style-4.html">Header Style 4</a>
                            <a className="items-list" href="feature-header-style-5.html">Header Style 5</a>
                            <a className="items-list" href="feature-header-style-6.html">Header Style 6</a>
                        </div>
                        <a className="items-list" href="#page-title-style-links" data-bs-toggle="collapse">Page
                            Title<span><i className="fa fa-caret-down arrow"></i></span></a>
                        <div className="collapse sub-menu mega-sub-menu-links" id="page-title-style-links">
                            <a className="items-list" href="feature-page-title-style-1.html">Page Title Style 1</a>
                            <a className="items-list" href="feature-page-title-style-2.html">Page Title Style 2</a>
                            <a className="items-list" href="feature-page-title-style-3.html">Page Title Style 3</a>
                            <a className="items-list" href="feature-page-title-style-4.html">Page Title Style 4</a>
                            <a className="items-list" href="feature-page-title-style-5.html">Page Title Style 5</a>
                            <a className="items-list" href="feature-page-title-style-6.html">Page Title Style 6</a>
                        </div>
                        <a className="items-list" href="#footer-style-links" data-bs-toggle="collapse">Footer<span><i
                                    className="fa fa-caret-down arrow"></i></span></a>
                        <div className="collapse sub-menu mega-sub-menu-links" id="footer-style-links">
                            <a className="items-list" href="feature-footer-style-1.html">Footer Style 1</a>
                            <a className="items-list" href="feature-footer-style-2.html">Footer Style 2</a>
                            <a className="items-list" href="feature-footer-style-3.html">Footer Style 3</a>
                            <a className="items-list" href="feature-footer-style-4.html">Footer Style 4</a>
                            <a className="items-list" href="feature-footer-style-5.html">Footer Style 5</a>
                        </div>
                        <a className="items-list" href="#f-blog-links" data-bs-toggle="collapse">Blog<span><i
                                    className="fa fa-caret-down arrow"></i></span></a>
                        <div className="collapse sub-menu mega-sub-menu-links" id="f-blog-links">
                            <a className="items-list" href="blog-listing-left-sidebar.html">Blog Listing Left
                                Sidebar</a>
                            <a className="items-list" href="blog-listing-right-sidebar.html">Blog Listing Right
                                Sidebar</a>
                            <a className="items-list" href="blog-detail-left-sidebar.html">Blog Detail Left Sidebar</a>
                            <a className="items-list" href="blog-detail-right-sidebar.html">Blog Detail Right
                                Sidebar</a>
                        </div>
                        <a className="items-list" href="#f-gallery-links" data-bs-toggle="collapse">Gallery<span><i
                                    className="fa fa-caret-down arrow"></i></span></a>
                        <div className="collapse sub-menu mega-sub-menu-links" id="f-gallery-links">
                            <a className="items-list" href="gallery-masonry.html">Gallery Masonry</a>
                            <a className="items-list" href="gallery-2-columns.html">Gallery 2 Columns</a>
                            <a className="items-list" href="gallery-3-columns.html">Gallery 3 Columns</a>
                            <a className="items-list" href="gallery-4-columns.html">Gallery 4 Columns</a>
                        </div>
                        <a className="items-list" href="#f-forms-links" data-bs-toggle="collapse">Forms<span><i
                                    className="fa fa-caret-down arrow"></i></span></a>
                        <div className="collapse sub-menu mega-sub-menu-links" id="f-forms-links">
                            <a className="items-list" href="login-1.html">Login 1</a>
                            <a className="items-list" href="login-2.html">Login 2</a>
                            <a className="items-list" href="registration-1.html">Registration 1</a>
                            <a className="items-list" href="registration-2.html">Registration 2</a>
                            <a className="items-list" href="forgot-password-1.html">Forgot Password 1</a>
                            <a className="items-list" href="forgot-password-2.html">Forgot Password 2</a>
                        </div>
                    </div>

                    <a className="items-list" href="#pages-links" data-bs-toggle="collapse"><span><i
                                className="fa fa-clone link-icon"></i></span>Pages<span><i
                                className="fa fa-chevron-down arrow"></i></span></a>
                    <div className="collapse sub-menu" id="pages-links">
                        <div className="list-group-heading ">Standard <span>Pages</span></div>
                        <a className="items-list" href="about-us-1.html">About Us 1</a>
                        <a className="items-list" href="about-us-2.html">About Us 2</a>
                        <a className="items-list" href="services-1.html">Services 1</a>
                        <a className="items-list" href="services-2.html">Services 2</a>
                        <a className="items-list" href="team-1.html">Our Team 1</a>
                        <a className="items-list" href="team-2.html">Our Team 2</a>
                        <a className="items-list" href="contact-us-1.html">Contact Us 1</a>
                        <a className="items-list" href="contact-us-2.html">Contact Us 2</a>
                        <div className="list-group-heading ">User <span>Dashboard</span></div>
                        <a className="items-list" href="dashboard-1.html">Dashboard 1</a>
                        <a className="items-list" href="dashboard-2.html">Dashboard 2</a>
                        <a className="items-list" href="user-profile.html">User Profile</a>
                        <a className="items-list" href="booking.html">Booking</a>
                        <a className="items-list" href="wishlist.html">Wishlist</a>
                        <a className="items-list" href="cards.html">Cards</a>
                        <div className="list-group-heading ">Special <span>Pages</span></div>
                        <a className="items-list" href="error-page-1.html">404 Page 1</a>
                        <a className="items-list" href="error-page-2.html">404 Page 2</a>
                        <a className="items-list" href="coming-soon-1.html">Coming Soon 1</a>
                        <a className="items-list" href="coming-soon-2.html">Coming Soon 2</a>
                        <a className="items-list" href="faq-left-sidebar.html">FAQ Left Sidebar</a>
                        <a className="items-list" href="faq-right-sidebar.html">FAQ Right Sidebar</a>
                        <a className="items-list" href="testimonials-1.html">Testimonials 1</a>
                        <a className="items-list" href="testimonials-2.html">Testimonials 2</a>
                        <div className="list-group-heading ">Extra <span>Pages</span></div>
                        <a className="items-list" href="before-you-fly.html">Before Fly</a>
                        <a className="items-list" href="travel-insurance.html">Travel Insurance</a>
                        <a className="items-list" href="travel-guide.html">Travel Guide</a>
                        <a className="items-list" href="holidays.html">Holidays</a>
                        <a className="items-list" href="thank-you.html">Thank You</a>
                        <a className="items-list" href="payment-success.html">Payment Success</a>
                        <a className="items-list" href="pricing-table-1.html">Pricing Table 1</a>
                        <a className="items-list" href="pricing-table-2.html">Pricing Table 2</a>
                        <a className="items-list" href="popup-ad.html">Popup Ad</a>
                    </div>

                </div>
            </div>
        </nav>
    </div>


    <section class="innerpage-wrapper">
            <div id="search-result-page" class="innerpage-section-padding">
                <div class="container">
                    <div class="row">
                        
                        <div class="col-12 col-md-12 col-lg-12 col-xl-12 content-side">
                            <div class="page-search-form">
                                <h2>Search the <span>Flight <i class="fa fa-plane"></i></span></h2>
                                
                               <Form onSubmit={handleSubmit1}>
                              
  
  
  
                               <div class="row">

  <ul class="nav nav-tabs">
                                    <li class="nav-item"><a class="nav-link active"  data-bs-toggle="tab" onClick={(e)=>setFlightType(true)}>Round Trip</a></li>
                                    <li class="nav-item"><a class="nav-link"  data-bs-toggle="tab" onClick={(e)=>setFlightType(false)}>One Way</a></li>
    </ul>
   
   
                                                      
                                                        <Form.Group controlId="cabinclass">
                                                        <Typeahead
                                                            labelKey="cabinclass"
                                                            options={cabin_details}
                                                            placeholder="Cabin Class"
                                                            ref={(ref) => cabinclass = ref}
                                                        />
                                                        
                                                      {status.cabinclass && <ErrorLabel message="Please select cabin class"></ErrorLabel>}
                                                        </Form.Group>
                                                     
                                                    </div>



                               
   
                               
                                <div class="tab-content">
                                 {isReturn  === true && 
                                    <div id="tab-round-trip" class="tab-pane in active">
                                        <form class="pg-search-form">
                                            <div class="row">
                                                <div class="col-12 col-md-6 col-lg-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label><span><i class="fa fa-map-marker"></i></span>From</label>
                                                        <Form.Group controlId="origin">
                                                        <Typeahead
                                                            labelKey="origin"
                                                            options={airports}
                                                            placeholder="Destination, City, Country"
                                                            ref={(ref) => origin = ref}
                                                        />
                                                      {status.origin && <ErrorLabel message="Please enter a valid airport"></ErrorLabel>}
                                                        </Form.Group>
                                                     
                                                    </div>
                                                </div>
                                                
                                                <div class="col-12 col-md-6 col-lg-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label><span><i class="fa fa-map-marker"></i></span>To</label>
                                                        <Form.Group controlId='destination'>
                                                    <Typeahead
                                                    labelKey="destination"
                                                    options={airports}
                                                    placeholder="Destination, City, Country"
                                                    ref={(ref) => destination = ref}
                                                />
                                                {/*{status.destination && <ErrorLabel message="Please enter a valid airport"></ErrorLabel>}*/}
                                                </Form.Group>
                                                    </div>
                                                </div>
                                                
                                                <div class="col-12 col-md-12 col-lg-4 col-xl-4">
                                                    <div class="row">
                                                        <div class="col-6 col-md-6">
                                                            <div class="form-group">
                                                                <label><span><i class="fa fa-calendar"></i></span>Departing</label>
                                                                <Form.Group controlId="formGriddateOfDep">
                                                  
                                                    <Form.Control type="date"  class="form-control dpd1" name="dateOfDep"  placeholder="departure" required />
                                                    {status.dateOfDep && <ErrorLabel message="Please enter a valid return date"></ErrorLabel>}
                                                    </Form.Group>
                                                            </div>
                                                        </div>
                                                        
                                                        <div class="col-6 col-md-6">
                                                            <div class="form-group">
                                                                <label><span><i class="fa fa-calendar"></i></span>Returning</label>
                                                                <Form.Group controlId="formGriddateOfReturn"> 
                                                   
                                                  
                                                  <Form.Control type="date"  class="form-control dpd1" name="returnDate"   required />
                                                  {status.returnDate && <ErrorLabel message="Please enter a valid return date"></ErrorLabel>}
                                                  </Form.Group>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="col-12 col-md-12 col-lg-2 col-xl-2">
                                                    <div class="form-group">
                                                        <label><span><i class="fa fa-users"></i></span>Passengers</label>
                                                     {/*  <Form.Group controlId="formGriddateOfDep">
                                                  
                                                  <Form.Control type="number"  class="form-control dpd1" name="passengers"  placeholder="Total" min="0" required />
                                                  {status.passengers && <ErrorLabel message="Please enter a valid return date"></ErrorLabel>}
                                 </Form.Group>*/}
                                               <div className="headerSearchItem">
               
                <span
                  onClick={() => setOpenOptions(!openOptions)}
                  className="headerSearchText"
                >{`${options.adult} adult · ${options.children} children · ${options.infant} infant`}</span>

                {openOptions && (
                  <div className="options">
                    <div className="optionItem">
                      <span className="optionText">Adult</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.adult <= 1}
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.adult}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Children</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.children <= 0}
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.children}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Infant</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.infant <= 1}
                          className="optionCounterButton"
                          onClick={() => handleOption("Infant", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.infant}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("Infant", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

                                                                                                       </div>

                                                </div>
                                            </div>
                                            
                                            <button class="btn btn-orange">Search</button>
                                        </form>
                                    </div>}
                                    {isReturn  === false && 
                                    <div id="tab-one-way" class="tab-pane in active">
                                    
                                        <form class="pg-search-form">
                                        
                                            <div class="row">
                                                <div class="col-12 col-md-6 col-lg-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label><span><i class="fa fa-map-marker"></i></span>From</label>
                                                        <Form.Group controlId="origin">
                                                        <Typeahead
                                                            labelKey="origin"
                                                            options={airports}
                                                            placeholder="Destination, City, Country"
                                                            ref={(ref) => origin = ref}
                                                        />
                                                       {/* {status.origin && <ErrorLabel message="Please enter a valid airport"></ErrorLabel>}*/}
                                                        </Form.Group>
                                                    </div>
                                                </div>
                                                
                                                <div class="col-12 col-md-6 col-lg-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label><span><i class="fa fa-map-marker"></i></span>To</label>
                                                        <Form.Group controlId='destination'>
                                                    <Typeahead
                                                    labelKey="destination"
                                                    options={airports}
                                                    placeholder="Destination, City, Country"
                                                    ref={(ref) => destination = ref}
                                                    
                                                />
                                               {/* {status.destination && <ErrorLabel message="Please enter a valid airport"></ErrorLabel>}*/}
                                               </Form.Group>
                                                    </div>
                                                </div>
                                                
                                                <div class="col-12 col-md-6 col-lg-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label><span><i class="fa fa-calendar"></i></span>Departing</label>
                                                        <Form.Group controlId="formGriddateOfDep">
                                                  
                                                  <Form.Control type="date"  class="form-control dpd1" name="dateOfDep"  placeholder="departure" required />
                                                  {status.dateOfDep && <ErrorLabel message="Please enter a valid return date"></ErrorLabel>}
                                                  </Form.Group>
                                                    </div>
                                                </div>
                                                
                                                <div class="col-12 col-md-6 col-lg-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label><span><i class="fa fa-users"></i></span>Passengers</label>
                                                       {/* <Form.Group controlId="passengers">
                                                  
                                                  <Form.Control type="number"  class="form-control dpd1" name="passengers"  placeholder="Total" min="0" required />
                                                  
                                    </Form.Group> */}
                                           <div className="headerSearchItem">
              
                <span
                  onClick={() => setOpenOptions(!openOptions)}
                  className="headerSearchText"
                >{`${options.adult} adult · ${options.children} children · ${options.infant} infant`}</span>
                {openOptions && (
                  <div className="options">
                    <div className="optionItem">
                      <span className="optionText">Adult</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.adult <= 1}
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.adult}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Children</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.children <= 0}
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.children}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Infant</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.infant <= 1}
                          className="optionCounterButton"
                          onClick={() => handleOption("infant", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.infant}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("infant", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

                                                                                  </div>
                                                </div>
                                            </div>
                                            
                                            <button class="btn btn-orange">Search</button>
                                        </form>
                                    </div>}
                                </div>
                                </Form>
                            </div>
                         
                            
                            
                            <div class="row">
                            
                                <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                                    <div class="grid-block main-block f-grid-block">
                                        <a href="flight-detail-left-sidebar.html">
                                            <div class="main-img f-img">
                                                <img src="images/flight-1.jpg" class="img-fluid" alt="flight-img" />
                                            </div>
                                        </a>
                                        <ul class="list-unstyled list-inline offer-price-1">
                                            <li class="price">$568.00<span class="divider">|</span><span class="pkg">2 Stay</span></li>
                                        </ul>
                                        
                                        <div class="block-info f-grid-info">
                                            <div class="f-grid-desc">
                                                <span class="f-grid-time"><i class="fa fa-clock-o"></i>6 hours - 30 minutes</span>
                                                <h3 class="block-title"><a href="flight-detail-left-sidebar.html">Sydney to Paris</a></h3>
                                                <p class="block-minor"><span>Fr 5379,</span> Oneway Flight</p>
                                                <p>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius prodesset pri. Veniam delectus ei </p>
                                            </div>
                                            
                                            <div class="f-grid-timing">
                                                <ul class="list-unstyled">
                                                    <li><span><i class="fa fa-plane"></i></span><span class="date">Aug, 02-2017 </span>(8:40 PM)</li>
                                                    <li><span><i class="fa fa-plane"></i></span><span class="date">Aug, 03-2017 </span>(8:40 PM)</li>
                                                </ul>
                                            </div>
                                            
                                            <div class="grid-btn">
                                                <a href="flight-detail-left-sidebar.html" class="btn btn-orange btn-block btn-lg">View More</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                                    <div class="grid-block main-block f-grid-block">
                                        <a href="flight-detail-left-sidebar.html">
                                            <div class="main-img f-img">
                                                <img src="images/flight-2.jpg" class="img-fluid" alt="flight-img" />
                                            </div>
                                        </a>
                                        <ul class="list-unstyled list-inline offer-price-1">
                                            <li class="price">$568.00<span class="divider">|</span><span class="pkg">2 Stay</span></li>
                                        </ul>
                                        
                                        <div class="block-info f-grid-info">
                                            <div class="f-grid-desc">
                                                <span class="f-grid-time"><i class="fa fa-clock-o"></i>6 hours - 30 minutes</span>
                                                <h3 class="block-title"><a href="flight-detail-left-sidebar.html">Sydney to Paris</a></h3>
                                                <p class="block-minor"><span>Fr 5379,</span> Oneway Flight</p>
                                                <p>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius prodesset pri. Veniam delectus ei </p>
                                            </div>
                                            
                                            <div class="f-grid-timing">
                                                <ul class="list-unstyled">
                                                    <li><span><i class="fa fa-plane"></i></span><span class="date">Aug, 02-2017 </span>(8:40 PM)</li>
                                                    <li><span><i class="fa fa-plane"></i></span><span class="date">Aug, 03-2017 </span>(8:40 PM)</li>
                                                </ul>
                                            </div>
                                            
                                            <div class="grid-btn">
                                                <a href="flight-detail-left-sidebar.html" class="btn btn-orange btn-block btn-lg">View More</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                                    <div class="grid-block main-block f-grid-block">
                                        <a href="flight-detail-left-sidebar.html">
                                            <div class="main-img f-img">
                                                <img src="images/flight-3.jpg" class="img-fluid" alt="flight-img" />
                                            </div>
                                        </a>
                                        <ul class="list-unstyled list-inline offer-price-1">
                                            <li class="price">$568.00<span class="divider">|</span><span class="pkg">2 Stay</span></li>
                                        </ul>
                                        
                                        <div class="block-info f-grid-info">
                                            <div class="f-grid-desc">
                                                <span class="f-grid-time"><i class="fa fa-clock-o"></i>6 hours - 30 minutes</span>
                                                <h3 class="block-title"><a href="flight-detail-left-sidebar.html">Sydney to Paris</a></h3>
                                                <p class="block-minor"><span>Fr 5379,</span> Oneway Flight</p>
                                                <p>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius prodesset pri. Veniam delectus ei </p>
                                            </div>
                                            
                                            <div class="f-grid-timing">
                                                <ul class="list-unstyled">
                                                    <li><span><i class="fa fa-plane"></i></span><span class="date">Aug, 02-2017 </span>(8:40 PM)</li>
                                                    <li><span><i class="fa fa-plane"></i></span><span class="date">Aug, 03-2017 </span>(8:40 PM)</li>
                                                </ul>
                                            </div>
                                            
                                            <div class="grid-btn">
                                                <a href="flight-detail-left-sidebar.html" class="btn btn-orange btn-block btn-lg">View More</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                                    <div class="grid-block main-block f-grid-block">
                                        <a href="flight-detail-left-sidebar.html">
                                            <div class="main-img f-img">
                                                <img src="images/flight-4.jpg" class="img-fluid" alt="flight-img" />
                                            </div>
                                        </a>
                                        <ul class="list-unstyled list-inline offer-price-1">
                                            <li class="price">$568.00<span class="divider">|</span><span class="pkg">2 Stay</span></li>
                                        </ul>
                                        
                                        <div class="block-info f-grid-info">
                                            <div class="f-grid-desc">
                                                <span class="f-grid-time"><i class="fa fa-clock-o"></i>6 hours - 30 minutes</span>
                                                <h3 class="block-title"><a href="flight-detail-left-sidebar.html">Sydney to Paris</a></h3>
                                                <p class="block-minor"><span>Fr 5379,</span> Oneway Flight</p>
                                                <p>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius prodesset pri. Veniam delectus ei </p>
                                            </div>
                                            
                                            <div class="f-grid-timing">
                                                <ul class="list-unstyled">
                                                    <li><span><i class="fa fa-plane"></i></span><span class="date">Aug, 02-2017 </span>(8:40 PM)</li>
                                                    <li><span><i class="fa fa-plane"></i></span><span class="date">Aug, 03-2017 </span>(8:40 PM)</li>
                                                </ul>
                                            </div>
                                            
                                            <div class="grid-btn">
                                                <a href="flight-detail-left-sidebar.html" class="btn btn-orange btn-block btn-lg">View More</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                                    <div class="grid-block main-block f-grid-block">
                                        <a href="flight-detail-left-sidebar.html">
                                            <div class="main-img f-img">
                                                <img src="images/flight-5.jpg" class="img-fluid" alt="flight-img" />
                                            </div>
                                        </a>
                                        <ul class="list-unstyled list-inline offer-price-1">
                                            <li class="price">$568.00<span class="divider">|</span><span class="pkg">2 Stay</span></li>
                                        </ul>
                                        
                                        <div class="block-info f-grid-info">
                                            <div class="f-grid-desc">
                                                <span class="f-grid-time"><i class="fa fa-clock-o"></i>6 hours - 30 minutes</span>
                                                <h3 class="block-title"><a href="flight-detail-left-sidebar.html">Sydney to Paris</a></h3>
                                                <p class="block-minor"><span>Fr 5379,</span> Oneway Flight</p>
                                                <p>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius prodesset pri. Veniam delectus ei </p>
                                            </div>
                                            
                                            <div class="f-grid-timing">
                                                <ul class="list-unstyled">
                                                    <li><span><i class="fa fa-plane"></i></span><span class="date">Aug, 02-2017 </span>(8:40 PM)</li>
                                                    <li><span><i class="fa fa-plane"></i></span><span class="date">Aug, 03-2017 </span>(8:40 PM)</li>
                                                </ul>
                                            </div>
                                            
                                            <div class="grid-btn">
                                                <a href="flight-detail-left-sidebar.html" class="btn btn-orange btn-block btn-lg">View More</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                                    <div class="grid-block main-block f-grid-block">
                                        <a href="flight-detail-left-sidebar.html">
                                            <div class="main-img f-img">
                                                <img src="images/flight-6.jpg" class="img-fluid" alt="flight-img" />
                                            </div>
                                        </a>
                                        <ul class="list-unstyled list-inline offer-price-1">
                                            <li class="price">$568.00<span class="divider">|</span><span class="pkg">2 Stay</span></li>
                                        </ul>
                                        
                                        <div class="block-info f-grid-info">
                                            <div class="f-grid-desc">
                                                <span class="f-grid-time"><i class="fa fa-clock-o"></i>6 hours - 30 minutes</span>
                                                <h3 class="block-title"><a href="flight-detail-left-sidebar.html">Sydney to Paris</a></h3>
                                                <p class="block-minor"><span>Fr 5379,</span> Oneway Flight</p>
                                                <p>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius prodesset pri. Veniam delectus ei </p>
                                            </div>
                                            
                                            <div class="f-grid-timing">
                                                <ul class="list-unstyled">
                                                    <li><span><i class="fa fa-plane"></i></span><span class="date">Aug, 02-2017 </span>(8:40 PM)</li>
                                                    <li><span><i class="fa fa-plane"></i></span><span class="date">Aug, 03-2017 </span>(8:40 PM)</li>
                                                </ul>
                                            </div>
                                            
                                            <div class="grid-btn">
                                                <a href="flight-detail-left-sidebar.html" class="btn btn-orange btn-block btn-lg">View More</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div> 
                        </div>
        
                    </div>
                </div>
            </div>
        </section>
        
    <section className="flexslider-container" id="flexslider-container-1">

        <div className="flexslider slider" id="slider-1">
            <ul className="slides">
            <li class="item-2 flex-active-slide" style={mystyle}>
                        <div class=" meta">         
                            <div class="container">
                                <h2>Discover</h2>
                                <h1>Australia</h1>
                                <a href="#" class="btn btn-default">View More</a>
                            </div>  
                        </div>
                    </li>
                <li className="item-1" style={mystyle}>
                    <div className=" meta">
                        <div className="container">
                            <h2>Discover</h2>
                            <h1>Australia</h1>
                            <a href="#" className="btn btn-default">View More</a>
                        </div>
                    </div>
                </li>

                <li className="item-2" >
                    <div className=" meta">
                        <div className="container">
                            <h2>Discover</h2>
                            <h1>Australia</h1>
                            <a href="#" className="btn btn-default">View More</a>
                        </div>
                    </div>
                </li>

            </ul>
        </div>

        <div className="search-tabs" id="search-tabs-1">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">

                        <ul className="nav nav-tabs justify-content-center">
                            <li className="nav-item">
                                            <a className="nav-link active" href="#flights"
                                    data-bs-toggle="tab"><span><i className="fa fa-plane"></i></span><span
                                        className="d-md-inline-flex d-none st-text">Flights</span></a></li>
                            <li className="nav-item"><a className="nav-link" href="#hotels" data-bs-toggle="tab"><span><i
                                            className="fa fa-building"></i></span><span
                                        className="d-md-inline-flex d-none st-text">Hotels</span></a></li>
                            <li className="nav-item"><a className="nav-link" href="#tours" data-bs-toggle="tab"><span><i
                                            className="fa fa-suitcase"></i></span><span
                                        className="d-md-inline-flex d-none st-text">Tours</span></a></li>
                            <li className="nav-item"><a className="nav-link" href="#cruise" data-bs-toggle="tab"><span><i
                                            className="fa fa-ship"></i></span><span
                                        className="d-md-inline-flex d-none st-text">Cruise</span></a></li>
                            <li className="nav-item"><a className="nav-link" href="#cars" data-bs-toggle="tab"><span><i
                                            className="fa fa-car"></i></span><span
                                        className="d-md-inline-flex d-none st-text">Cars</span></a></li>
                        </ul>
                    <searchForm></searchForm>
                        <div className="tab-content">


                            <div id="flights" className="tab-pane in active">
                               {/* <Form onSubmit={handleSubmit}>
                                <Form.Group >
                                <Form.Check
                                    inline
                                    checked={!isReturn}
                                    type="radio"
                                    label="One way"
                                    name="flightType"
                                    id="formHorizontalRadios1"
                                    onChange={(e)=>setFlightType(false)}
                                />
                                <Form.Check
                                    inline
                                    checked={isReturn}
                                    type="radio"
                                    label="Return"
                                    name="flightType"
                                    id="formHorizontalRadios2"
                                    onChange={(e)=>setFlightType(true)}
                                />
                                </Form.Group>
                                {isReturn  === true && 
                                <div className="row">

                                        <div className="col-12 col-md-12 col-lg-5 col-xl-4">
                                            <div className="row">

                                                <div className="col-12 col-md-6 col-lg-6">
                                                    <div className="form-group left-icon">
                                                    <Form.Group controlId='origin'>
                                                    <Typeahead
                                                    labelKey="origin"
                                                    options={airports}
                                                    placeholder="From"
                                                    ref={(ref) => origin = ref}
                                                /></Form.Group>
                                                {status.origin && <ErrorLabel message="Please enter a valid airport"></ErrorLabel>}
                                                       
                                                        <i className="fa fa-map-marker"></i>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-6 col-lg-6">
                                                    <div className="form-group left-icon">
                                                    <Form.Group controlId='destination'>
                                                    <Typeahead
                                                    labelKey="destination"
                                                    options={airports}
                                                    placeholder="To"
                                                    ref={(ref) => destination = ref}
                                                /></Form.Group>
                                                {status.destination && <ErrorLabel message="Please enter a valid airport"></ErrorLabel>}
                                                       
                                                        <i className="fa fa-map-marker"></i>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-5 col-xl-4">
                                            <div className="row">
                                       
                                                <div className="col-6 col-md-6 col-lg-6">
                                                    <div className="form-group left-icon">
                                                     
                                                    <Form.Group controlId="formGriddateOfDep">
                                                  
                                                    <Form.Control type="date"  class="form-control dpd1" name="dateOfDep"  placeholder="departure" required />
                                                    {status.returnDate && <ErrorLabel message="Please enter a valid return date"></ErrorLabel>}
                                                    </Form.Group>
                                                       
                                                    </div>
                                                </div>
                                              
          
                                                <div className="col-6 col-md-6 col-lg-6">
                                                    <div className="form-group left-icon">
                                                    <Form.Group controlId="formGriddateOfReturn"> 
                                                    <Form.Control type="date" name="dateOfReturn"  required />
                                                    </Form.Group>
                                                       
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-2 col-xl-2">
                                            <div className="form-group right-icon">
                                            <Form.Group controlId="exampleForm.ControlSelect1">
                                            <Form.Control as="select" className="form-control" name="numOfPassengers" placeholder="Adult">
                                                <option>Adults</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </Form.Control>
                                            </Form.Group>
                                                   
                                                
                                                <i className="fa fa-angle-down"></i>
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-12 col-xl-2 search-btn">
                                        
                                            <button className="btn btn-orange" type="submit"> Search</button>
                                        </div>

                                    </div>}
                                    {isReturn  === false && <div className="row">

<div className="col-12 col-md-12 col-lg-5 col-xl-4">
    <div className="row">

        <div className="col-12 col-md-6 col-lg-6">
            <div className="form-group left-icon">
            <Form.Group controlId='origin'>
            <Typeahead
            labelKey="origin"
            options={airports}
            placeholder="From"
            ref={(ref) => origin = ref}
        /></Form.Group>
        {status.origin && <ErrorLabel message="Please enter a valid airport"></ErrorLabel>}
               
                <i className="fa fa-map-marker"></i>
            </div>
        </div>

        <div className="col-12 col-md-6 col-lg-6">
            <div className="form-group left-icon">
            <Form.Group controlId='destination'>
            <Typeahead
            labelKey="destination"
            options={airports}
            placeholder="To"
            ref={(ref) => destination = ref}
        /></Form.Group>
        {status.destination && <ErrorLabel message="Please enter a valid airport"></ErrorLabel>}
              
                <i className="fa fa-map-marker"></i>
            </div>
        </div>

    </div>
</div>

<div className="col-12 col-md-12 col-lg-2 col-xl-2">
    <div className="row">

       
            <div className="form-group left-icon">
             
            <Form.Group controlId="formGriddateOfDep">

            <Form.Control type="date" name="dateOfDep"  placeholder="yyyy-mm-dd" required />
            {status.returnDate && <ErrorLabel message="Please enter a valid return date"></ErrorLabel>}
            </Form.Group>
               
         
        </div>
       
            


    </div>
</div>

<div className="col-12 col-md-12 col-lg-2 col-xl-2">
    <div className="form-group right-icon">
    <Form.Group controlId="exampleForm.ControlSelect1">
    <Form.Control as="select" className="form-control" name="numOfPassengers" placeholder="Adult">
        <option>Adults</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
    </Form.Control>
    </Form.Group>
           
        
        <i className="fa fa-angle-down"></i>
    </div>
</div>

<div className="col-12 col-md-12 col-lg-12 col-xl-2 search-btn">

    <button className="btn btn-orange" type="submit"> Search</button>
</div>


</div>}


        
                                </Form>*/}
                                
                                </div>

                <div id="hotels" className="tab-pane">
                                <form>
                                    <div className="row">

                                        <div className="col-12 col-md-12 col-lg-6 col-xl-5">
                                            <div className="row">

                                                <div className="col-12 col-md-6">
                                                    <div className="form-group left-icon">
                                                        <input type="text" className="form-control dpd1"
                                                            placeholder="Check In"/>
                                                        <i className="fa fa-calendar"></i>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <div className="form-group left-icon">
                                                        <input type="text" className="form-control dpd2"
                                                            placeholder="Check Out"/>
                                                        <i className="fa fa-calendar"></i>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-6 col-xl-5">
                                            <div className="row">

                                                <div className="col-12 col-md-12 col-lg-4">
                                                    <div className="form-group right-icon">
                                                        <select className="form-control">
                                                            <option selected>Rooms</option>
                                                            <option>1</option>
                                                            <option>2</option>
                                                            <option>3</option>
                                                        </select>
                                                        <i className="fa fa-angle-down"></i>
                                                    </div>
                                                </div>

                                                <div className="col-6 col-md-6 col-lg-4">
                                                    <div className="form-group right-icon">
                                                        <select className="form-control">
                                                            <option selected>Adults</option>
                                                            <option>1</option>
                                                            <option>2</option>
                                                            <option>3</option>
                                                        </select>
                                                        <i className="fa fa-angle-down"></i>
                                                    </div>
                                                </div>

                                                <div className="col-6 col-md-6 col-lg-4">
                                                    <div className="form-group right-icon">
                                                        <select className="form-control">
                                                            <option selected>Kids</option>
                                                            <option>0</option>
                                                            <option>1</option>
                                                            <option>2</option>
                                                        </select>
                                                        <i className="fa fa-angle-down"></i>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-12 col-xl-2 search-btn">
                                            <button className="btn btn-orange">Search</button>
                                        </div>

                                    </div>
                                </form>
                            </div>

                            <div id="tours" className="tab-pane">
                                <form>
                                    <div className="row">

                                        <div className="col-12 col-md-12 col-lg-3 col-xl-4">
                                            <div className="form-group left-icon">
                                                <input type="text" className="form-control"
                                                    placeholder="City,Country" />
                                                <i className="fa fa-map-marker"></i>
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-3 col-xl-3">
                                            <div className="form-group right-icon">
                                                <select className="form-control">
                                                    <option selected>Month</option>
                                                    <option>January</option>
                                                    <option>February</option>
                                                    <option>March</option>
                                                    <option>April</option>
                                                    <option>May</option>
                                                    <option>June</option>
                                                    <option>July</option>
                                                    <option>August</option>
                                                    <option>September</option>
                                                    <option>October</option>
                                                    <option>November</option>
                                                    <option>December</option>
                                                </select>
                                                <i className="fa fa-angle-down"></i>
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-6 col-xl-3">
                                            <div className="row">

                                                <div className="col-12 col-md-6">
                                                    <div className="form-group right-icon">
                                                        <select className="form-control">
                                                            <option selected>Adults</option>
                                                            <option>1</option>
                                                            <option>2</option>
                                                            <option>3</option>
                                                        </select>
                                                        <i className="fa fa-angle-down"></i>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <div className="form-group right-icon">
                                                        <select className="form-control">
                                                            <option selected>Kids</option>
                                                            <option>0</option>
                                                            <option>1</option>
                                                            <option>2</option>
                                                        </select>
                                                        <i className="fa fa-angle-down"></i>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-12 col-xl-2 search-btn">
                                            <button className="btn btn-orange">Search</button>
                                        </div>

                                    </div>
                                </form>
                            </div>

                            <div id="cruise" className="tab-pane">
                                <form>
                                    <div className="row">

                                        <div className="col-12 col-md-12 col-lg-5 col-xl-4">
                                            <div className="row">

                                                <div className="col-12 col-md-6 col-lg-6">
                                                    <div className="form-group left-icon">
                                                        <input type="text" className="form-control" placeholder="From"/>
                                                        <i className="fa fa-map-marker"></i>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-6 col-lg-6">
                                                    <div className="form-group left-icon">
                                                        <input type="text" className="form-control" placeholder="To"/>
                                                        <i className="fa fa-map-marker"></i>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-5 col-xl-4">
                                            <div className="row">

                                                <div className="col-6 col-md-6 col-lg-6">
                                                    <div className="form-group left-icon">
                                                        <input type="text" className="form-control dpd1"
                                                            placeholder="Check In"/>
                                                        <i className="fa fa-calendar"></i>
                                                    </div>
                                                </div>

                                                <div className="col-6 col-md-6 col-lg-6">
                                                    <div className="form-group left-icon">
                                                        <input type="text" className="form-control dpd2"
                                                            placeholder="Check Out"/>
                                                        <i className="fa fa-calendar"></i>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-2 col-xl-2">
                                            <div className="form-group right-icon">
                                                <select className="form-control">
                                                    <option selected>Adults</option>
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                </select>
                                                <i className="fa fa-angle-down"></i>
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-12 col-xl-2 search-btn">
                                            <button className="btn btn-orange">Search</button>
                                        </div>

                                    </div>
                                </form>
                            </div>

                            <div id="cars" className="tab-pane">
                                <form>
                                    <div className="row">

                                        <div className="col-12 col-md-12 col-lg-7 col-xl-6">
                                            <div className="row">

                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group left-icon">
                                                        <input type="text" className="form-control"
                                                            placeholder="Country" />
                                                        <i className="fa fa-globe"></i>
                                                    </div>
                                                </div>

                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group left-icon">
                                                        <input type="text" className="form-control"
                                                            placeholder="City" />
                                                        <i className="fa fa-map-marker"></i>
                                                    </div>
                                                </div>

                                                <div className="col-md-12 col-lg-4">
                                                    <div className="form-group left-icon">
                                                        <input type="text" className="form-control"
                                                            placeholder="Location" />
                                                        <i className="fa fa-street-view"></i>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-5 col-xl-4">
                                            <div className="row">

                                                <div className="col-6 col-md-6 col-lg-6">
                                                    <div className="form-group left-icon">
                                                        <input type="text" className="form-control dpd1"
                                                            placeholder="Check In"/>
                                                        <i className="fa fa-calendar"></i>
                                                    </div>
                                                </div>

                                                <div className="col-6 col-md-6 col-lg-6">
                                                    <div className="form-group left-icon">
                                                        <input type="text" className="form-control dpd2"
                                                            placeholder="Check Out"/>
                                                        <i className="fa fa-calendar"></i>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-12 col-xl-2 search-btn">
                                            <button className="btn btn-orange">Search</button>
                                        </div>

                                    </div>
                                </form>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>

    </section>


    
    <section id="hotel-offers" className="section-padding">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="page-heading">
                        <h2>Hotels Offers</h2>
                        <hr className="heading-line" />
                    </div>

                    <div className="owl-carousel owl-theme owl-custom-arrow" id="owl-hotel-offers">

                        <div className="item">
                            <div className="main-block hotel-block">
                                <div className="main-img">
                                    <a href="#">
                                        <img src="../assets/hotel-1.jpg" className="img-fluid" alt="hotel-img" />
                                    </a>
                                    <div className="main-mask">
                                        <ul className="list-unstyled list-inline offer-price-1">
                                            <li className="list-inline-item price">$568.00<span
                                                    className="divider">|</span><span className="pkg">Avg/Night</span></li>
                                            <li className="list-inline-item rating">
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star lightgrey"></i></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="main-info hotel-info">
                                    <div className="arrow">
                                        <a href="#"><span><i className="fa fa-angle-right"></i></span></a>
                                    </div>

                                    <div className="main-title hotel-title">
                                        <a href="#">Herta Berlin Hotel</a>
                                        <p>From: Scotland</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="item">
                            <div className="main-block hotel-block">
                                <div className="main-img">
                                    <a href="#">
                                        <img src="../assets/hotel-2.jpg" className="img-fluid" alt="hotel-img" />
                                    </a>
                                    <div className="main-mask">
                                        <ul className="list-unstyled list-inline offer-price-1">
                                            <li className="list-inline-item price">$568.00<span
                                                    className="divider">|</span><span className="pkg">Avg/Night</span></li>
                                            <li className="list-inline-item rating">
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star lightgrey"></i></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="main-info hotel-info">
                                    <div className="arrow">
                                        <a href="#"><span><i className="fa fa-angle-right"></i></span></a>
                                    </div>

                                    <div className="main-title hotel-title">
                                        <a href="#">Roosevelt Hotel</a>
                                        <p>From: Germany</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="item">
                            <div className="main-block hotel-block">
                                <div className="main-img">
                                    <a href="#">
                                        <img src="../assets/hotel-3.jpg" className="img-fluid" alt="hotel-img" />
                                    </a>
                                    <div className="main-mask">
                                        <ul className="list-unstyled list-inline offer-price-1">
                                            <li className="list-inline-item price">$568.00<span
                                                    className="divider">|</span><span className="pkg">Avg/Night</span></li>
                                            <li className="list-inline-item rating">
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star lightgrey"></i></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="main-info hotel-info">
                                    <div className="arrow">
                                        <a href="#"><span><i className="fa fa-angle-right"></i></span></a>
                                    </div>

                                    <div className="main-title hotel-title">
                                        <a href="#">Hotel Fort De</a>
                                        <p>From: Austria</p>
                                    </div>{/*end hotel-title */}
                                </div>{/* end hotel-info */}
                            </div>{/*end hotel-block */}
                        </div>{/* end item */}

                        <div className="item">
                            <div className="main-block hotel-block">
                                <div className="main-img">
                                    <a href="#">
                                        <img src="../assets/hotel-4.jpg" className="img-fluid" alt="hotel-img" />
                                    </a>
                                    <div className="main-mask">
                                        <ul className="list-unstyled list-inline offer-price-1">
                                            <li className="list-inline-item price">$568.00<span
                                                    className="divider">|</span><span className="pkg">Avg/Night</span></li>
                                            <li className="list-inline-item rating">
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star lightgrey"></i></span>
                                            </li>
                                        </ul>
                                    </div>{/* end main-mask */}
                                </div>{/* end offer-img */}

                                <div className="main-info hotel-info">
                                    <div className="arrow">
                                        <a href="#"><span><i className="fa fa-angle-right"></i></span></a>
                                    </div>{/* end arrow */}

                                    <div className="main-title hotel-title">
                                        <a href="#">Roosevelt Hotel</a>
                                        <p>From: Germany</p>
                                    </div>{/* end hotel-title */}
                                </div>{/* end hotel-info */}
                            </div>{/* end hotel-block */}
                        </div>{/* end item */}

                    </div>{/* end owl-hotel-offers */}

                    <div className="view-all text-center">
                        <a href="#" className="btn btn-orange">View All</a>
                    </div>{/* end view-all */}
                </div>
            </div>
        </div>
    </section>{/* end hotel-offers */}


    {/*======================= BEST FEATURES =====================*/}
    <section id="best-features" className="banner-padding black-features">
        <div className="container">
            <div className="row">
                <div className="col-md-6 col-lg-3">
                    <div className="b-feature-block">
                        <span><i className="fa fa-dollar"></i></span>
                        <h3>Best Price Guarantee</h3>
                        <p>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius prodesset pri. Veniam
                            delectus ei vis.</p>
                    </div>{/* end b-feature-block */}
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="b-feature-block">
                        <span><i className="fa fa-lock"></i></span>
                        <h3>Safe and Secure</h3>
                        <p>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius prodesset pri. Veniam
                            delectus ei vis.</p>
                    </div>{/* end b-feature-block */}
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="b-feature-block">
                        <span><i className="fa fa-thumbs-up"></i></span>
                        <h3>Best Travel Agents</h3>
                        <p>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius prodesset pri. Veniam
                            delectus ei vis.</p>
                    </div>{/* end b-feature-block */}
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="b-feature-block">
                        <span><i className="fa fa-bars"></i></span>
                        <h3>Travel Guidelines</h3>
                        <p>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius prodesset pri. Veniam
                            delectus ei vis.</p>
                    </div>{/* end b-feature-block */}
                </div>
            </div>
        </div>
    </section>{/* end best-features */}


    {/*=============== TOUR OFFERS ===============*/}
    <section id="tour-offers" className="section-padding">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="page-heading">
                        <h2>Tour Offers</h2>
                        <hr className="heading-line" />
                    </div>{/* end page-heading */}

                    <div className="owl-carousel owl-theme owl-custom-arrow" id="owl-tour-offers">

                        <div className="item">
                            <div className="main-block tour-block">
                                <div className="main-img">
                                    <a href="#">
                                        <img src="../assets/images/tour-1.jpg" className="img-fluid" alt="tour-img" />
                                    </a>
                                </div>{/* end offer-img */}

                                <div className="offer-price-2">
                                    <ul className="list-unstyled">
                                        <li className="price">$568.00<a href="#"><span className="arrow"><i
                                                        className="fa fa-angle-right"></i></span></a></li>
                                    </ul>
                                </div>{/* end offer-price-2 */}

                                <div className="main-info tour-info">
                                    <div className="main-title tour-title">
                                        <a href="#">China Temple Tour</a>
                                        <p>From: China</p>
                                        <div className="rating">
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star grey"></i></span>
                                        </div>
                                    </div>{/* end tour-title */}
                                </div>{/* end tour-info */}
                            </div>{/* end tour-block */}
                        </div>{/* end item */}

                        <div className="item">
                            <div className="main-block tour-block">
                                <div className="main-img">
                                    <a href="#">
                                        <img src="../assets/images/tour-2.jpg" className="img-fluid" alt="tour-img" />
                                    </a>
                                </div>{/* end offer-img */}

                                <div className="offer-price-2">
                                    <ul className="list-unstyled">
                                        <li className="price">$745.00<a href="#"><span className="arrow"><i
                                                        className="fa fa-angle-right"></i></span></a></li>
                                    </ul>
                                </div>{/* end offer-price-2 */}

                                <div className="main-info tour-info">
                                    <div className="main-title tour-title">
                                        <a href="#">African Safari Tour</a>
                                        <p>From: Africa</p>
                                        <div className="rating">
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star grey"></i></span>
                                        </div>
                                    </div>{/* end tour-title */}
                                </div>{/* end tour-info */}
                            </div>{/* end tour-block */}
                        </div>{/* end item */}

                        <div className="item">
                            <div className="main-block tour-block">
                                <div className="main-img">
                                    <a href="#">
                                        <img src="../assets/images/tour-3.jpg" className="img-fluid" alt="tour-img" />
                                    </a>
                                </div>{/* end offer-img */}

                                <div className="offer-price-2">
                                    <ul className="list-unstyled">
                                        <li className="price">$459.00<a href="#"><span className="arrow"><i
                                                        className="fa fa-angle-right"></i></span></a></li>
                                    </ul>
                                </div>{/* end offer-price-2 */}

                                <div className="main-info tour-info">
                                    <div className="main-title tour-title">
                                        <a href="#">Paris City Tour</a>
                                        <p>From: Paris</p>
                                        <div className="rating">
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star grey"></i></span>
                                        </div>
                                    </div>{/* end tour-title */}
                                </div>{/* end tour-info */}
                            </div>{/* end tour-block */}
                        </div>{/* end item */}

                        <div className="item">
                            <div className="main-block tour-block">
                                <div className="main-img">
                                    <a href="#">
                                        <img src="../assets/images/tour-4.jpg" className="img-fluid" alt="tour-img" />
                                    </a>
                                </div>{/* end offer-img */}

                                <div className="offer-price-2">
                                    <ul className="list-unstyled">
                                        <li className="price">$745.00<a href="#"><span className="arrow"><i
                                                        className="fa fa-angle-right"></i></span></a></li>
                                    </ul>
                                </div>{/* end offer-price-2 */}

                                <div className="main-info tour-info">
                                    <div className="main-title tour-title">
                                        <a href="#">China Temple Tour</a>
                                        <p>From: China</p>
                                        <div className="rating">
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star grey"></i></span>
                                        </div>
                                    </div>{/* end tour-title */}
                                </div>{/* end tour-info */}
                            </div>{/* end tour-block */}
                        </div>{/* end item */}

                    </div>{/* end owl-tour-offers */}

                    <div className="view-all text-center">
                        <a href="#" className="btn btn-orange">View All</a>
                    </div>{/* end view-all */}
                </div>
            </div>
        </div>
    </section>{/* end tour-offers */}


    {/*=============== CRUISE OFFERS ===============*/}
    <section id="cruise-offers" className="section-padding">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="page-heading">
                        <h2>Cruise Offers</h2>
                        <hr className="heading-line" />
                    </div>{/* end page-heading */}

                    <div className="row">
                        <div className="col-md-6 col-lg-6">
                            <div className="main-block cruise-block">
                                <div className="row">

                                    <div className="col-md-12 col-lg-6 col-lg-pull-6 no-pd-r">
                                        <div className=" main-info cruise-info">
                                            <div className="main-title cruise-title">
                                                <a href="#">Spain Boat Tour</a>
                                                <p>From: Italy to Spain</p>
                                                <div className="rating">
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star grey"></i></span>
                                                </div>{/* end rating */}

                                                <span className="cruise-price">$950.00</span>
                                            </div>{/* end cruise-title */}
                                        </div>{/* end cruise-info */}
                                    </div>

                                    <div className="col-md-12 col-lg-6 col-lg-push-6 no-pd-l">
                                        <div className="main-img cruise-img">
                                            <a href="#">
                                                <img src="../assets/images/cruise-1.jpg" className="img-fluid" alt="cruise-img" />
                                                <div className="cruise-mask">
                                                    <p>7 Nights, 6 Days</p>
                                                </div>{/* end cruise-mask */}
                                            </a>
                                        </div>{/* end cruise-img */}
                                    </div>

                                </div>
                            </div>{/* end cruise-block */}
                        </div>

                        <div className="col-md-6 col-lg-6">
                            <div className="main-block cruise-block">
                                <div className="row">

                                    <div className="col-md-12 col-lg-6 col-lg-pull-6 no-pd-r">
                                        <div className=" main-info cruise-info">
                                            <div className="main-title cruise-title">
                                                <a href="#">Spain Boat Tour</a>
                                                <p>From: Italy to Spain</p>
                                                <div className="rating">
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star grey"></i></span>
                                                </div>{/* end rating */}

                                                <span className="cruise-price">$950.00</span>
                                            </div>{/* end cruise-title */}
                                        </div>{/* end cruise-info */}
                                    </div>

                                    <div className="col-md-12 col-lg-6 col-lg-push-6 no-pd-l">
                                        <div className="main-img cruise-img">
                                            <a href="#">
                                                <img src="../assets/images/cruise-2.jpg" className="img-fluid" alt="cruise-img" />
                                                <div className="cruise-mask">
                                                    <p>7 Nights, 6 Days</p>
                                                </div>{/* end cruise-mask */}
                                            </a>
                                        </div>{/* end cruise-img */}
                                    </div>

                                </div>
                            </div>{/* end cruise-block */}
                        </div>

                        <div className="col-md-6 col-lg-6">
                            <div className="main-block cruise-block">
                                <div className="row">

                                    <div className="col-md-12 col-lg-6 col-lg-pull-6 no-pd-r">
                                        <div className=" main-info cruise-info">
                                            <div className="main-title cruise-title">
                                                <a href="#">Spain Boat Tour</a>
                                                <p>From: Italy to Spain</p>
                                                <div className="rating">
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star grey"></i></span>
                                                </div>{/* end rating */}

                                                <span className="cruise-price">$950.00</span>
                                            </div>{/* end cruise-title */}
                                        </div>{/* end cruise-info */}
                                    </div>

                                    <div className="col-md-12 col-lg-6 col-lg-push-6 no-pd-l">
                                        <div className="main-img cruise-img">
                                            <a href="#">
                                                <img src="../assets/images/cruise-3.jpg" className="img-fluid" alt="cruise-img" />
                                                <div className="cruise-mask">
                                                    <p>7 Nights, 6 Days</p>
                                                </div>{/* end cruise-mask */}
                                            </a>
                                        </div>{/* end cruise-img */}
                                    </div>

                                </div>
                            </div>{/* end cruise-block */}
                        </div>

                        <div className="col-md-6 col-lg-6">
                            <div className="main-block cruise-block">
                                <div className="row">

                                    <div className="col-md-12 col-lg-6 col-lg-pull-6 no-pd-r">
                                        <div className=" main-info cruise-info">
                                            <div className="main-title cruise-title">
                                                <a href="#">Spain Boat Tour</a>
                                                <p>From: Italy to Spain</p>
                                                <div className="rating">
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star orange"></i></span>
                                                    <span><i className="fa fa-star grey"></i></span>
                                                </div>{/* end rating */}

                                                <span className="cruise-price">$950.00</span>
                                            </div>{/* end cruise-title */}
                                        </div>{/* end cruise-info */}
                                    </div>

                                    <div className="col-md-12 col-lg-6 col-lg-push-6 no-pd-l">
                                        <div className="main-img cruise-img">
                                            <a href="#">
                                                <img src="../assets/images/cruise-4.jpg" className="img-fluid" alt="cruise-img" />
                                                <div className="cruise-mask">
                                                    <p>7 Nights, 6 Days</p>
                                                </div>{/* end cruise-mask */}
                                            </a>
                                        </div>{/* end cruise-img */}
                                    </div>

                                </div>
                            </div>{/* end cruise-block */}
                        </div>
                    </div>

                    <div className="view-all text-center">
                        <a href="#" className="btn btn-orange">View All</a>
                    </div>{/* end view-all */}
                </div>
            </div>
        </div>
    </section>{/* end cruise-offers */}


    {/*==================== VIDEO BANNER ===================*/}
    <section id="video-banner" className="banner-padding back-size">
        <div className="container">
            <div className="row">
                <div className="col-sm">
                    <h2>Take a Video Tour</h2>
                    <p>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius prodesset pri. Veniam
                        delectus ei vis. Est atqui timeam mnesarchum at, pro an eros perpetua ullamcorper.</p>
                    <div className="margin-small py-5 mt-5 m-sm-0 "></div>

                    {/* Button trigger modal */}
                    <button type="button" className="btn video-btn" id="play-button" data-bs-toggle="modal"
                        data-src="https://www.youtube.com/embed/0O2aH4XLbto" data-bs-target="#myModal"><span><i
                                className="fa fa-play mt-0 m-sm-0"></i></span>
                    </button>

                    {/* Modal */}
                    <div className="modal fade" id="myModal" tabindex="-1" role="dialog"
                        aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">

                                <div className="modal-body">

                                    <button type="button" className="btn close" data-bs-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    {/* 16:9 aspect ratio */}

                                    <div className="ratio ratio-16x9">
                                        <iframe className="embed-responsive-item" src="" id="video"
                                            allowscriptaccess="always"></iframe>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>{/* end video-banner */}


    {/*================= FLIGHT OFFERS =============*/}
    <section id="flight-offers" className="section-padding">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="page-heading">
                        <h2>Flight Offers</h2>
                        <hr className="heading-line" />
                    </div>{/* end page-heading */}

                    <div className="row">

                        <div className="col-md-6 col-lg-4">
                            <div className="main-block flight-block">
                                <a href="#">
                                    <div className="flight-img">
                                        <img src="../assets/images/flight-1.jpg" className="img-fluid" alt="flight-img" />
                                    </div>{/* end flight-img */}

                                    <div className="flight-info">
                                        <div className="flight-title">
                                            <h3><span className="flight-destination">Spain</span>|<span
                                                    className="flight-type">OneWay Flight</span></h3>
                                        </div>{/* end flight-title */}

                                        <div className=" flight-timing">
                                            <ul className="list-unstyled">
                                                <li><span><i className="fa fa-plane"></i></span><span className="date">Aug,
                                                        02-2017 </span>(8:40 PM)</li>
                                                <li><span><i className="fa fa-plane"></i></span><span className="date">Aug,
                                                        03-2017 </span>(8:40 PM)</li>
                                            </ul>
                                        </div>{/* end flight-timing */}

                                        <ul className="list-unstyled list-inline offer-price-1">
                                            <li className="list-inline-item price">$568.00<span
                                                    className="pkg">Avg/Person</span></li>
                                            <li className="list-inline-item rating">
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star lightgrey"></i></span>
                                            </li>
                                        </ul>
                                    </div>{/* end flight-info */}
                                </a>
                            </div>{/* end flight-block */}
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="main-block flight-block">
                                <a href="#">
                                    <div className="flight-img">
                                        <img src="../assets/images/flight-2.jpg" className="img-fluid" alt="flight-img" />
                                    </div>{/* end flight-img */}

                                    <div className="flight-info">
                                        <div className="flight-title">
                                            <h3><span className="flight-destination">Spain</span>|<span
                                                    className="flight-type">OneWay Flight</span></h3>
                                        </div>{/* end flight-title */}

                                        <div className=" flight-timing">
                                            <ul className="list-unstyled">
                                                <li><span><i className="fa fa-plane"></i></span><span className="date">Aug,
                                                        02-2017 </span>(8:40 PM)</li>
                                                <li><span><i className="fa fa-plane"></i></span><span className="date">Aug,
                                                        03-2017 </span>(8:40 PM)</li>
                                            </ul>
                                        </div>{/* end flight-timing */}

                                        <ul className="list-unstyled list-inline offer-price-1">
                                            <li className="list-inline-item price">$568.00<span
                                                    className="pkg">Avg/Person</span></li>
                                            <li className="list-inline-item rating">
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star lightgrey"></i></span>
                                            </li>
                                        </ul>
                                    </div>{/* end flight-info */}
                                </a>
                            </div>{/* end flight-block */}
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="main-block flight-block">
                                <a href="#">
                                    <div className="flight-img">
                                        <img src="../assets/images/flight-3.jpg" className="img-fluid" alt="flight-img" />
                                    </div>{/* end flight-img */}

                                    <div className="flight-info">
                                        <div className="flight-title">
                                            <h3><span className="flight-destination">Spain</span>|<span
                                                    className="flight-type">OneWay Flight</span></h3>
                                        </div>{/* end flight-title */}

                                        <div className=" flight-timing">
                                            <ul className="list-unstyled">
                                                <li><span><i className="fa fa-plane"></i></span><span className="date">Aug,
                                                        02-2017 </span>(8:40 PM)</li>
                                                <li><span><i className="fa fa-plane"></i></span><span className="date">Aug,
                                                        03-2017 </span>(8:40 PM)</li>
                                            </ul>
                                        </div>{/* end flight-timing */}

                                        <ul className="list-unstyled list-inline offer-price-1">
                                            <li className="list-inline-item price">$568.00<span
                                                    className="pkg">Avg/Person</span></li>
                                            <li className="list-inline-item rating">
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star lightgrey"></i></span>
                                            </li>
                                        </ul>
                                    </div>{/* end flight-info */}
                                </a>
                            </div>{/* end flight-block */}
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="main-block flight-block">
                                <a href="#">
                                    <div className="flight-img">
                                        <img src="../assets/images/flight-4.jpg" className="img-fluid" alt="flight-img" />
                                    </div>{/* end flight-img */}

                                    <div className="flight-info">
                                        <div className="flight-title">
                                            <h3><span className="flight-destination">Spain</span>|<span
                                                    className="flight-type">OneWay Flight</span></h3>
                                        </div>{/* end flight-title */}

                                        <div className=" flight-timing">
                                            <ul className="list-unstyled">
                                                <li><span><i className="fa fa-plane"></i></span><span className="date">Aug,
                                                        02-2017 </span>(8:40 PM)</li>
                                                <li><span><i className="fa fa-plane"></i></span><span className="date">Aug,
                                                        03-2017 </span>(8:40 PM)</li>
                                            </ul>
                                        </div>{/* end flight-timing */}

                                        <ul className="list-unstyled list-inline offer-price-1">
                                            <li className="list-inline-item price">$568.00<span
                                                    className="pkg">Avg/Person</span></li>
                                            <li className="list-inline-item rating">
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star lightgrey"></i></span>
                                            </li>
                                        </ul>
                                    </div>{/* end flight-info */}
                                </a>
                            </div>{/* end flight-block */}
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="main-block flight-block">
                                <a href="#">
                                    <div className="flight-img">
                                        <img src="../assets/images/flight-5.jpg" className="img-fluid" alt="flight-img" />
                                    </div>{/* end flight-img */}

                                    <div className="flight-info">
                                        <div className="flight-title">
                                            <h3><span className="flight-destination">Spain</span>|<span
                                                    className="flight-type">OneWay Flight</span></h3>
                                        </div>{/* end flight-title */}

                                        <div className=" flight-timing">
                                            <ul className="list-unstyled">
                                                <li><span><i className="fa fa-plane"></i></span><span className="date">Aug,
                                                        02-2017 </span>(8:40 PM)</li>
                                                <li><span><i className="fa fa-plane"></i></span><span className="date">Aug,
                                                        03-2017 </span>(8:40 PM)</li>
                                            </ul>
                                        </div>{/* end flight-timing */}

                                        <ul className="list-unstyled list-inline offer-price-1">
                                            <li className="list-inline-item price">$568.00<span
                                                    className="pkg">Avg/Person</span></li>
                                            <li className="list-inline-item rating">
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star lightgrey"></i></span>
                                            </li>
                                        </ul>
                                    </div>{/* end flight-info */}
                                </a>
                            </div>{/* end flight-block */}
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="main-block flight-block">
                                <a href="#">
                                    <div className="flight-img">
                                        <img src="../assets/images/flight-6.jpg" className="img-fluid" alt="flight-img" />
                                    </div>{/* end flight-img */}

                                    <div className="flight-info">
                                        <div className="flight-title">
                                            <h3><span className="flight-destination">Spain</span>|<span
                                                    className="flight-type">OneWay Flight</span></h3>
                                        </div>{/* end flight-title */}

                                        <div className=" flight-timing">
                                            <ul className="list-unstyled">
                                                <li><span><i className="fa fa-plane"></i></span><span className="date">Aug,
                                                        02-2017 </span>(8:40 PM)</li>
                                                <li><span><i className="fa fa-plane"></i></span><span className="date">Aug,
                                                        03-2017 </span>(8:40 PM)</li>
                                            </ul>
                                        </div>{/* end flight-timing */}

                                        <ul className="list-unstyled list-inline offer-price-1">
                                            <li className="list-inline-item price">$568.00<span
                                                    className="pkg">Avg/Person</span></li>
                                            <li className="list-inline-item rating">
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star orange"></i></span>
                                                <span><i className="fa fa-star lightgrey"></i></span>
                                            </li>
                                        </ul>
                                    </div>{/* end flight-info */}
                                </a>
                            </div>{/* end flight-block */}
                        </div>

                    </div>

                    <div className="view-all text-center">
                        <a href="#" className="btn btn-orange">View All</a>
                    </div>{/* end view-all */}
                </div>
            </div>
        </div>
    </section>{/* end flight-offers */}


    {/*==================== HIGHLIGHTS ====================*/}
    <section id="highlights" className="section-padding back-size">
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="row">

                        <div className="col-12 col-md-4 col-lg-4 col-xl-4 d-flex justify-content-center">
                            <div className="highlight-box">
                                <div className="h-icon">
                                    <span><i className="fa fa-plane"></i></span>
                                </div>{/* end h-icon */}

                                <div className="h-text">
                                    <span className="numbers">2496</span>
                                    <p>Outstanding Tours</p>
                                </div>{/* end h-text */}
                            </div>{/* end highlight-box */}
                        </div>

                        <div className="col-12 col-md-4 col-lg-4 col-xl-4 d-flex justify-content-center">
                            <div className="highlight-box">
                                <div className="h-icon">
                                    <span><i className="fa fa-ship"></i></span>
                                </div>{/* end h-icon */}

                                <div className="h-text cruise">
                                    <span className="numbers">1906</span>
                                    <p>Worldwide Cruise</p>
                                </div>{/* end h-text */}
                            </div>{/* end highlight-box */}
                        </div>

                        <div className="col-12 col-md-4 col-lg-4 col-xl-4 d-flex justify-content-center">
                            <div className="highlight-box">
                                <div className="h-icon">
                                    <span><i className="fa fa-taxi"></i></span>
                                </div>{/* end h-icon */}

                                <div className="h-text taxi">
                                    <span className="numbers">2033</span>
                                    <p>Luxury Car Booking</p>
                                </div>{/* end h-text */}
                            </div>{/* end highlight-box */}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>{/* end highlights */}


    {/*================ VEHICLE OFFERS ==============*/}
    <section id="vehicle-offers" className="section-padding">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="page-heading">
                        <h2>Vehicle Offers</h2>
                        <hr className="heading-line" />
                    </div>{/* end page-heading */}

                    <div className="row">

                        <div className="col-md-6 col-lg-4">
                            <div className="main-block vehicle-block">
                                <div className="main-img vehicle-img">
                                    <a href="#">
                                        <img src="../assets/images/vehicle-1.jpg" className="img-fluid" alt="tour-img" />
                                    </a>
                                    <div className="vehicle-time">
                                        <p><span><i className="fa fa-clock-o"></i></span>22/h</p>
                                    </div>{/* end vehicle-time */}
                                </div>{/* end vehicle-img */}

                                <div className="offer-price-2">
                                    <ul className="list-unstyled">
                                        <li className="price">$89<a href="#"><span className="arrow"><i
                                                        className="fa fa-angle-right"></i></span></a></li>
                                    </ul>
                                </div>{/* end offer-price-2 */}

                                <div className="main-info vehicle-info">
                                    <div className="main-title vehicle-title">
                                        <a href="#">Mercedes Benz</a>
                                        <p>Per Day</p>
                                        <div className="rating">
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star lightgrey"></i></span>
                                        </div>
                                    </div>{/* end vehicle-title */}
                                </div>{/* end vehicle-info */}
                            </div>{/* end vehicle-block */}
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="main-block vehicle-block">
                                <div className="main-img vehicle-img">
                                    <a href="#">
                                        <img src="../assets/images/vehicle-2.jpg" className="img-fluid" alt="tour-img" />
                                    </a>
                                    <div className="vehicle-time">
                                        <p><span><i className="fa fa-clock-o"></i></span>22/h</p>
                                    </div>{/* end vehicle-time */}
                                </div>{/* end vehicle-img */}

                                <div className="offer-price-2">
                                    <ul className="list-unstyled">
                                        <li className="price">$99<a href="#"><span className="arrow"><i
                                                        className="fa fa-angle-right"></i></span></a></li>
                                    </ul>
                                </div>{/* end offer-price-2 */}

                                <div className="main-info vehicle-info">
                                    <div className="main-title vehicle-title">
                                        <a href="#">Ferrari</a>
                                        <p>Per Day</p>
                                        <div className="rating">
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star lightgrey"></i></span>
                                        </div>
                                    </div>{/* end vehicle-title */}
                                </div>{/* end vehicle-info */}
                            </div>{/* end vehicle-block */}
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="main-block vehicle-block">
                                <div className="main-img vehicle-img">
                                    <a href="#">
                                        <img src="../assets/images/vehicle-3.jpg" className="img-fluid" alt="tour-img" />
                                    </a>
                                    <div className="vehicle-time">
                                        <p><span><i className="fa fa-clock-o"></i></span>22/h</p>
                                    </div>{/* end vehicle-time */}
                                </div>{/* end vehicle-img */}

                                <div className="offer-price-2">
                                    <ul className="list-unstyled">
                                        <li className="price">$79<a href="#"><span className="arrow"><i
                                                        className="fa fa-angle-right"></i></span></a></li>
                                    </ul>
                                </div>{/* end offer-price-2 */}

                                <div className="main-info vehicle-info">
                                    <div className="main-title vehicle-title">
                                        <a href="#">Range Rover</a>
                                        <p>Per Day</p>
                                        <div className="rating">
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star orange"></i></span>
                                            <span><i className="fa fa-star lightgrey"></i></span>
                                        </div>
                                    </div>{/* end vehicle-title */}
                                </div>{/* end vehicle-info */}
                            </div>{/* end vehicle-block */}
                        </div>

                    </div>

                    <div className="view-all text-center">
                        <a href="#" className="btn btn-orange">View All</a>
                    </div>{/* end view-all */}
                </div>
            </div>
        </div>
    </section>{/* end vehicle-offers */}


    {/*==================== TESTIMONIALS ====================*/}
    <section id="testimonials" className="section-padding back-size">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="page-heading white-heading">
                        <h2>Testimonials</h2>
                        <hr className="heading-line" />
                    </div>{/* end page-heading */}

                    <div className="carousel slide" data-bs-ride="carousel" id="quote-carousel">
                        <div className="carousel-inner text-center">

                            <div className="carousel-item active">
                                <blockquote>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius
                                    prodesset pri. Veniam delectus ei vis. Est atqui timeam mnesarchum at, pro an
                                    eros perpetua ullamcorper Lorem ipsum dolor sit amet, ad duo fugit aeque
                                    fabulas, in lucilius prodesset pri. Veniam delectus ei vis. Est atqui timeam
                                    mnesarchum at, pro an eros perpetua ullamcorper.</blockquote>
                                <div className="rating">
                                    <span><i className="fa fa-star orange"></i></span>
                                    <span><i className="fa fa-star orange"></i></span>
                                    <span><i className="fa fa-star orange"></i></span>
                                    <span><i className="fa fa-star orange"></i></span>
                                    <span><i className="fa fa-star lightgrey"></i></span>
                                </div>{/* end rating */}

                                <small>Jhon Smith</small>
                            </div>{/* end item */}

                            <div className="carousel-item">
                                <blockquote>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius
                                    prodesset pri. Veniam delectus ei vis. Est atqui timeam mnesarchum at, pro an
                                    eros perpetua ullamcorper Lorem ipsum dolor sit amet, ad duo fugit aeque
                                    fabulas, in lucilius prodesset pri. Veniam delectus ei vis. Est atqui timeam
                                    mnesarchum at, pro an eros perpetua ullamcorper.</blockquote>
                                <div className="rating">
                                    <span><i className="fa fa-star orange"></i></span>
                                    <span><i className="fa fa-star orange"></i></span>
                                    <span><i className="fa fa-star orange"></i></span>
                                    <span><i className="fa fa-star orange"></i></span>
                                    <span><i className="fa fa-star lightgrey"></i></span>
                                </div>{/* end rating */}

                                <small>Jhon Smith</small>
                            </div>{/* end item */}

                            <div className="carousel-item">
                                <blockquote>Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in lucilius
                                    prodesset pri. Veniam delectus ei vis. Est atqui timeam mnesarchum at, pro an
                                    eros perpetua ullamcorper Lorem ipsum dolor sit amet, ad duo fugit aeque
                                    fabulas, in lucilius prodesset pri. Veniam delectus ei vis. Est atqui timeam
                                    mnesarchum at, pro an eros perpetua ullamcorper.</blockquote>
                                <div className="rating">
                                    <span><i className="fa fa-star orange"></i></span>
                                    <span><i className="fa fa-star orange"></i></span>
                                    <span><i className="fa fa-star orange"></i></span>
                                    <span><i className="fa fa-star orange"></i></span>
                                    <span><i className="fa fa-star lightgrey"></i></span>
                                </div>{/* end rating */}

                                <small>Jhon Smith</small>
                            </div>{/* end item */}

                        </div>{/* end carousel-inner */}

                        <ol className="carousel-indicators mx-auto">
                            <li data-bs-target="#quote-carousel" data-bs-slide-to="0" className="active"><img
                                    src="../assets/images/client-1.jpg" className="img-fluid d-block" alt="client-img"/>
                            </li>
                            <li data-bs-target="#quote-carousel" data-bs-slide-to="1"><img src="../assets/images/client-2.jpg"
                                    className="img-fluid d-block" alt="client-img"/>
                            </li>
                            <li data-bs-target="#quote-carousel" data-bs-slide-to="2"><img src="../assets/images/client-3.jpg"
                                    className="img-fluid d-block" alt="client-img"/>
                            </li>
                        </ol>

                    </div>{/* end quote-carousel */}
                </div>
            </div>
        </div>
    </section>{/* end testimonials */}


    {/*================ LATEST BLOG ==============*/}
    <section id="latest-blog" className="section-padding">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="page-heading">
                        <h2>Our Latest Blogs</h2>
                        <hr className="heading-line" />
                    </div>

                    <div className="row">

                        <div className="col-md-6 col-lg-4">
                            <div className="main-block latest-block">
                                <div className="main-img latest-img">
                                    <a href="#">
                                        <img src="../assets/images/latest-blog-1.jpg" className="img-fluid" alt="blog-img" />
                                    </a>
                                </div>{/* end latest-img */}

                                <div className="latest-info">
                                    <ul className="list-unstyled">
                                        <li><span><i className="fa fa-calendar-minus-o"></i></span>29 April,2017<span
                                                className="author">by: <a href="#">Jhon Smith</a></span></li>
                                    </ul>
                                </div>{/* end latest-info */}

                                <div className="main-info latest-desc">
                                    <div className="row">
                                        <div className="col-10 col-md-10 main-title">
                                            <a href="#">Travel Insuranve Benefits</a>
                                            <p>Veniam delectus ei vis. Est atqui timeam mnesarchum at, pro an eros
                                                perpetua ullamcorper.</p>
                                        </div>
                                    </div>

                                    <span className="arrow"><a href="#"><i className="fa fa-angle-right"></i></a></span>
                                </div>{/* end latest-desc */}
                            </div>{/* end latest-block */}
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="main-block latest-block">
                                <div className="main-img latest-img">
                                    <a href="#">
                                        <img src="../assets/images/latest-blog-2.jpg" className="img-fluid" alt="blog-img" />
                                    </a>
                                </div>{/* end latest-img */}

                                <div className="latest-info">
                                    <ul className="list-unstyled">
                                        <li><span><i className="fa fa-calendar-minus-o"></i></span>29 April,2017<span
                                                className="author">by: <a href="#">Jhon Smith</a></span></li>
                                    </ul>
                                </div>{/* end latest-info */}

                                <div className="main-info latest-desc">
                                    <div className="row">
                                        <div className="col-10 col-md-10 main-title">
                                            <a href="#">Travel Guideline Agents</a>
                                            <p>Veniam delectus ei vis. Est atqui timeam mnesarchum at, pro an eros
                                                perpetua ullamcorper.</p>
                                        </div>
                                    </div>

                                    <span className="arrow"><a href="#"><i className="fa fa-angle-right"></i></a></span>
                                </div>{/* end latest-desc */}
                            </div>{/* end latest-block */}
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="main-block latest-block">
                                <div className="main-img latest-img">
                                    <a href="#">
                                        <img src="../assets/images/latest-blog-3.jpg" className="img-fluid" alt="blog-img" />
                                    </a>
                                </div>{/* end latest-img */}

                                <div className="latest-info">
                                    <ul className="list-unstyled">
                                        <li><span><i className="fa fa-calendar-minus-o"></i></span>29 April,2017<span
                                                className="author">by: <a href="#">Jhon Smith</a></span></li>
                                    </ul>
                                </div>{/* end latest-info */}

                                <div className="main-info latest-desc">
                                    <div className="row">
                                        <div className="col-10 col-md-10 main-title">
                                            <a href="#">Secure Travel Tips</a>
                                            <p>Veniam delectus ei vis. Est atqui timeam mnesarchum at, pro an eros
                                                perpetua ullamcorper.</p>
                                        </div>
                                    </div>

                                    <span className="arrow"><a href="#"><i className="fa fa-angle-right"></i></a></span>
                                </div>{/* end latest-desc */}
                            </div>{/* end latest-block */}
                        </div>

                    </div>

                    <div className="view-all text-center">
                        <a href="#" className="btn btn-orange">View All</a>
                    </div>{/* end view-all */}
                </div>
            </div>
        </div>
    </section>{/* end latest-blog */} 



    <section id="newsletter-1" className="section-padding back-size newsletter">
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12 col-xl-12 text-center">
                    <h2>Subscribe Our Newsletter</h2>
                    <p>Subscibe to receive our interesting updates</p>
                    <form>
                        <div className="form-group">
                            <div className="input-group">
                                <input type="email" className="form-control input-lg"
                                    placeholder="Enter your email address" required />
                                <span className="input-group-btn"><button className="btn btn-lg"><i
                                            className="fa fa-envelope"></i></button></span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
    </div>
</body>
        </div>
    )

}

const mapStateToProps = (state) => ({
  flights: state.flights
})

const mapDispatchToProps = {
    findFlights,
    fetchFlights
}

export default connect(mapStateToProps, mapDispatchToProps)(Body);
