"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { supabase } from "../lib/supabaseClient";
import styles from "../styles/AdminAccess.module.css";

const InputField = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  isRequired = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>
        {label} {isRequired && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.inputWrapper}>
        <input
          className={styles.inputField}
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={isRequired}
          autoComplete={type === "password" ? "current-password" : "off"}
        />
        {type === "password" && (
          <span
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </span>
        )}
      </div>
    </div>
  );
};

export default function AdminAccessCard() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isRegister) {
      // REGISTRATION Logic
      if (formData.password !== formData.confirmPassword) {
        alert("Error: Passwords do not match!");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,

            phone_number: formData.phone,
          },
        },
      });

      if (error) {
        alert("Registration Error: " + error.message);
      } else if (data.user) {
        alert("Registration successful! You can now log in.");
      }
    } else {
      // LOGIN Logic
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert("Login Error: Invalid credentials.");
      } else if (data.user) {
        router.push("/admin-dashboard");
      }
    }
    setLoading(false);
  };

  const handleTabSwitch = (isReg) => {
    setIsRegister(isReg);
    setFormData({
      fullName: "",

      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className={styles.cardContainer}>
      <Link href="/" className={styles.backButton}>
        &larr; Back to Home
      </Link>
      <div className={styles.header}>
        <FaLock size={36} color="#198754" />
        <h1 className={styles.title}>Admin Access</h1>
        <p className={styles.subtitle}>
          Register as a new admin or login with existing credentials
        </p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${
            isRegister ? styles.activeTab : ""
          }`}
          onClick={() => handleTabSwitch(true)}
        >
          Register
        </button>
        <button
          className={`${styles.tabButton} ${
            !isRegister ? styles.activeTab : ""
          }`}
          onClick={() => handleTabSwitch(false)}
        >
          Login
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {isRegister ? (
          <>
            <InputField
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />

            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              isRequired={false}
            />
            <InputField
              label="Password (min 6 characters)"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              <FaLock size={16} style={{ marginRight: "0.5rem" }} />
              {loading ? "Registering..." : "Register Admin"}
            </button>
          </>
        ) : (
          <>
            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="Enter registered email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              <FaLock size={16} style={{ marginRight: "0.5rem" }} />
              {loading ? "Logging In..." : "Login"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
