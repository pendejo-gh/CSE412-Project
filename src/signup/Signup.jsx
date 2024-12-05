import React from "react";
import "./signup.css";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="addUser">
      <h3>Sign Up</h3>
      <form className="addUserForm">
        <div className="inputGroup">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="firstName"
            id="firstName"
            name="firstName"
            autoComplete="off"
            placeholder="Enter your First Name"
          />
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="lastName"
            id="lastName"
            name="lastName"
            autoComplete="off"
            placeholder="Enter your Last Name"
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            placeholder="Enter your Email"
          />
          <label htmlFor="Password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            placeholder="Enter Password"
          />
          <label htmlFor="role">Select Role:</label>
          <select id="role" name="role">
            <option value="user">Customer</option>
            <option value="admin">Restaurant</option>
          </select>
          <button type="submit" class="btn btn-success">
            Sign Up
          </button>
        </div>
      </form>
      <div className="login">
        <p>Already have an Account? </p>
        <Link to="/" type="submit" class="btn btn-primary">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
