import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import moment from "moment"; // Import Moment.js
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const Profile = () => {
  const user_id = localStorage.getItem("userId");
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  // Error state to manage validation errors
  const [errors, setErrors] = useState({});
  const [cardNumber, setCardNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const convertDate = (dateString) => {
    // Check if dateString is null or undefined
    if (!dateString) {
      console.warn("dateString is null or undefined");
      return ""; // Return an empty string or a default value as needed
    }

    console.log("dateString: " + dateString);
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string provided");
      return ""; // Return an empty string or a default value as needed
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // State for managing edit mode for each section
  const [editMode, setEditMode] = useState({
    contact: false,
    address: false,
    payment: false,
  });
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    userName: "",
    email: "",
    gender: "",
    birthDate: "",
    address: "",
    state: "",
    zip: "",
    nameOnCard: "",
    cardNumber: "",
    billingAddress: "",
    expirationDate: "",
    phoneNo: "",
  });

  useEffect(() => {
    getUserDetails(user_id);
  }, []);

  useEffect(() => {
    if (userData) {
      console.log(userData);
      setFormData({
        firstName: userData.firstName || "",
        middleName: userData.middleName || "",
        lastName: userData.lastName || "",
        userName: userData.userName || "",
        email: userData.email || "",
        gender: userData.gender || "",
        phoneNo: userData.phoneNo || "",
        birthDate: formatDateForInput(userData.birthDate) || "",
        address: userData.address || "",
        state: userData.state || "",
        zip: userData.zip || "",
        nameOnCard: userData.nameOnCard || "",
        cardNumber: userData.cardNumber || "",
        billingAddress: userData.billingAddress || "",
        expirationDate: formatDateForInput(userData.expirationDate) || "",
      });
    }
  }, [userData]);

  // Helper function to format date from ISO to yyyy-mm-dd for the input field
  const formatDateForInput = (isoDate) => {
    console.log("isoDate", isoDate);
    if (isoDate != null) {
      // Handle empty or invalid dates
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`; // Format to yyyy-mm-dd
    }
  };

  // Function to toggle edit mode
  const toggleEditMode = (section) => {
    setEditMode((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        apiUrl + "/authentication/profile/" + userId,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUserData(response.data);
      console.log("Full response: ", response);
    } catch (error) {
      if (error.response) {
        console.error("Response Error:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error", error.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    // Check if card number is empty
    if(name=='cardNumber'){
        if (value.replace(/[0-9\s]/g, '') !== '') {
          setErrorMessage('Card number must contain only digits and spaces.');
          return;
        }
        if (value.length > 20) {
          setErrorMessage('Invalid card number.');
        } else {
          setErrorMessage('');
        }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it has been corrected
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  
  const validateForm = () => {
    const newErrors = {};

    // Add validation logic for each field
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }
    // if (!formData.middleName.trim()) {
    //   newErrors.middleName = "Last Name is required";
    // }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    }
    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone number validation
    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required";
    } else if (!/^\d+$/.test(formData.phoneNo)) {
      // Allow only digits
      newErrors.phoneNo = "Phone number can only contain numeric characters";
    } else if (formData.phoneNo.length > 15) {
      newErrors.phoneNo = "Phone number cannot exceed 15 characters";
    }

    if (formData.birthDate && isNaN(Date.parse(formData.birthDate))) {
      newErrors.birthDate = "Invalid date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Validate before submitting
    if (!validateForm()) {
      return;
    }
    if (errorMessage) { // Check if there is an error
      return;
    }

    // Add confirmation before updating the profile
    const confirmation = window.confirm(
      "Are you sure you want to update your profile?"
    );
    if (!confirmation) {
      return; // If user cancels, abort the update
    }

    const configuration = {
      method: "put",
      url: apiUrl + `/authentication/profileUpdate/${user_id}`,
      data: {
        ...formData, // Spread the form data
      },
    };

    try {
      const result = await axios(configuration);
      console.log("update profile", result);
      toggleEditMode("contact"); // Close edit mode on successful update
      toggleEditMode("address");
      toggleEditMode("payment");
      console.log(result.data.user._doc.userName);
      localStorage.setItem("userName", result.data.user._doc.userName);
      alert(result.data.message);
      navigate(0);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert(`Error: ${error.response.status}`);
        }
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <Container className="mt-4" id="profile-container">
      {/* Profile Title */}
      <h2 className="mb-4">Profile</h2>

      <Form onSubmit={handleSubmit}>
        {/* Contact Information Section */}
        <Card className="mb-4">
          <Card.Header>
            <Row className="align-items-center">
              <Col>
                <strong>Contact Information</strong>
              </Col>
              <Col className="text-right">
                <Button
                  variant="link"
                  className="p-0 edit-link"
                  onClick={() => toggleEditMode("contact")}
                >
                  {editMode.contact ? "Cancel" : "Edit"}
                </Button>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            {!editMode.contact ? (
              // View Mode
              <>
                <Row>
                  <Col md={4}>
                    <strong>Name</strong>
                    <br />
                    {[
                      userData.firstName,
                      userData.middleName,
                      userData.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </Col>

                  <Col md={4}>
                    <strong>Date of birth</strong>
                    <br />
                    {convertDate(userData.birthDate)}
                  </Col>
                  <Col md={4}>
                    <strong>Email</strong>
                    <br />
                    {userData.email}
                  </Col>
                </Row>
                <br /> <br />
                <Row>
                  <Col md={4}>
                    <strong>Phone Number</strong>
                    <br />
                    {userData.phoneNo}
                  </Col>

                  <Col md={4}>
                    <strong>Gender</strong>
                    <br />
                    {userData.gender
                      ? userData.gender === "F" || userData.gender === "f"
                        ? "Female"
                        : "Male"
                      : ""}
                  </Col>

                  <Col md={4}>
                    <strong>Password</strong>
                    <br />
                    <small>
                      {" "}
                      {userData?.password
                        ? Array(10).fill(
                            <i
                              className="fa fa-circle"
                              style={{ fontSize: "10px", padding: "2px" }}
                            ></i>
                          )
                        : " "}
                    </small>
                  </Col>
                </Row>
              </>
            ) : (
              // Edit Mode
              <>
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        isInvalid={!!errors.firstName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Middle Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleInputChange}
                        isInvalid={!!errors.middleName}
                      />
                      {/* <Form.Control.Feedback type="invalid">
                        {errors.middleName}
                      </Form.Control.Feedback> */}
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        isInvalid={!!errors.lastName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="col-12">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    isInvalid={!!errors.userName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.userName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-12">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control
                    as="select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="col-12">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                    isInvalid={!!errors.phoneNo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phoneNo}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-12">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-12">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    isInvalid={!!errors.birthDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.birthDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}
          </Card.Body>
        </Card>
        {/* Address Information Section */}
        <Card className="mb-4">
          <Card.Header>
            <Row className="align-items-center">
              <Col>
                <strong>Address Information</strong>
              </Col>
              <Col className="text-right">
                <Button
                  variant="link"
                  className="p-0 edit-link"
                  onClick={() => toggleEditMode("address")}
                >
                  {editMode.address ? "Cancel" : "Edit"}
                </Button>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            {!editMode.address ? (
              // View Mode
              <>
                <Row>
                  <Col md={4}>
                    {
                      userData?.address || userData?.state || userData?.zip
                        ? `${userData?.address || ""}, ${
                            userData?.state || ""
                          }, ${userData?.zip || ""}`
                        : "" // Show blank if none are available
                    }
                  </Col>
                </Row>
              </>
            ) : (
              // Edit Mode
              <>
                <Row>
                  <Col md={4}>
                    <Form.Group className="col-12">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="col-12">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="col-12">
                      <Form.Label>Zip Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
          </Card.Body>
        </Card>
        {/* Payment Information Section */}
        <Card className="mb-4">
          <Card.Header>
            <Row className="align-items-center">
              <Col>
                <strong>Payment Information</strong>
              </Col>
              <Col className="text-right">
                <Button
                  variant="link"
                  className="p-0 edit-link"
                  onClick={() => toggleEditMode("payment")}
                >
                  {editMode.payment ? "Cancel" : "Edit"}
                </Button>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            {!editMode.payment ? (
              // View Mode
              <>
                <Row>
                  <Col md={4}>
                    <strong>Name on Card</strong>
                    <br />
                    {userData.nameOnCard}
                  </Col>
                  <Col md={4}>
                    {" "}
                    <strong>Card Number</strong>
                    <br />
                    {userData.cardNumber}
                  </Col>
                  <Col md={4}>
                    <strong>Billing Address</strong>
                    <br />
                    {userData.billingAddress}
                  </Col>
                </Row>
                <br /> <br />
                <Row>
                  <Col md={4}>
                    <strong>Expiration Date</strong>
                    <br />
                    {convertDate(userData.expirationDate)}
                  </Col>
                </Row>
              </>
            ) : (
              // Edit Mode
              <>
                <Form.Group className="col-12">
                  <Form.Label>Name on Card</Form.Label>
                  <Form.Control
                    type="text"
                    name="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="col-12">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                  />  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                </Form.Group>
                <Form.Group className="col-12">
                  <Form.Label>Billing Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="col-12">
                  <Form.Label>Expiration Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]} // Set min date to today's date
                  />
                </Form.Group>
              </>
            )}
          </Card.Body>
        </Card>
        {/* Save Changes Button */}
        {editMode.contact || editMode.address || editMode.payment ? (
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        ) : null}
      </Form>
    </Container>
  );
};

export default Profile;
