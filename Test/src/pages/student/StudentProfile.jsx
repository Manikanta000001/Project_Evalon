import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate} from "react-router-dom";

import { User, Mail, GraduationCap, Lock } from "lucide-react";
import necn from "../../../public/necn.avif";

export default function StudentProfile() {
  const { dark: isDarkMode } = useOutletContext() || {};
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // mock student data
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    department: "Computer Science",
  });
const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userdata"));
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        department: "Computer Science",
      });
    }
  }, []);
  useEffect(() => {
  if (error || success) {
    const timer = setTimeout(() => {
      
      setSuccess("");
    }, 3000); 

    return () => clearTimeout(timer);
  }
}, [ success]);

const handlePasswordUpdate = async () => {
  setError("");
  setSuccess("");

  const errors = {};

  if (!passwords.old) errors.old = true;
  if (!passwords.new) errors.new = true;
  if (!passwords.confirm) errors.confirm = true;

  if (Object.keys(errors).length > 0) {
    setFieldErrors(errors);
    setError("Please fill all required fields");
    return;
  }

  if (passwords.new !== passwords.confirm) {
    setError("New password and confirm password do not match");
    setFieldErrors({ new: true, confirm: true });
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/auth/change-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwords.old,
          newPassword: passwords.new,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    setSuccess("Password updated successfully");

    setPasswords({
      old: "",
      new: "",
      confirm: "",
    });

    setFieldErrors({});
  } catch (err) {
    setError(err.message);
  }
};

  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  return (
    <div className="space-y-8">
      {/* ================= BASIC INFO CARD ================= */}
      <div
        className={`p-6 rounded-2xl border ${
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <h3 className="font-bold text-lg mb-6">Profile Information</h3>

        <div className="flex items-center gap-6 mb-6">
          <img
            src={necn}
            className="w-20 h-20 rounded-2xl border object-cover object-center"
          />

          <div>
            <p className="text-sm text-slate-500">Profile Picture</p>
            <button className="mt-2 px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
              Change Avatar
            </button>
          </div>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="text-xs font-bold">Full Name</label>
            <div className="flex items-center gap-2 mt-1">
              <User size={16} className="text-slate-400" />
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className={`w-full px-3 py-2 rounded-lg border outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-200"
                }`}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold">Email</label>
            <div className="flex items-center gap-2 mt-1">
              <Mail size={16} className="text-slate-400" />
              <input
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className={`w-full px-3 py-2 rounded-lg border outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-200"
                }`}
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="text-xs font-bold">Department</label>
            <div className="flex items-center gap-2 mt-1">
              <GraduationCap size={16} className="text-slate-400" />
              <input
                value={profile.department}
                onChange={(e) =>
                  setProfile({ ...profile, department: e.target.value })
                }
                className={`w-full px-3 py-2 rounded-lg border outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-200"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= PASSWORD CARD ================= */}
      <div
        className={`p-6 rounded-2xl border ${
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <Lock className="text-emerald-500" /> Change Password
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs font-bold">Current Password</label>
            <input
              type="password"
              value={passwords.old}
              onChange={(e) => {
                setPasswords({ ...passwords, old: e.target.value });
                setFieldErrors({ ...fieldErrors, old: false });
              }}
              className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                fieldErrors.old
                  ? "border-red-500"
                  : isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-200"
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-bold">New Password</label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => {
                setPasswords({ ...passwords, new: e.target.value });
                setFieldErrors({ ...fieldErrors, new: false });
              }}
              className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                fieldErrors.new
                  ? "border-red-500"
                  : isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-200"
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-bold">Confirm Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => {
                setPasswords({ ...passwords, confirm: e.target.value });
                setFieldErrors({ ...fieldErrors, confirm: false });
              }}
              className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                fieldErrors.confirm
                  ? "border-red-500"
                  : isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-200"
              }`}
            />
          </div>
        </div>
        {error && (
          <p className="mt-4 text-sm font-medium text-red-500">{error}</p>
        )}
        {success && (
  <p className="mt-2 text-sm font-medium text-emerald-500">
    {success}
  </p>
)}

        <div className="mt-4 text-sm text-slate-500">
          <span
            className="text-indigo-600 cursor-pointer hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </div>

        <button
          onClick={handlePasswordUpdate}
          className="mt-6 px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
