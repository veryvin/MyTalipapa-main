import { useState } from "react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    contactNumber: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return alert("Please agree to the Terms and Privacy Policy.");
    if (form.password !== form.confirmPassword) return alert("Passwords do not match.");
    console.log(form);
  };

  const EyeToggle = ({ show, onToggle }) => (
    <button type="button" onClick={onToggle} className="text-gray-400 hover:text-gray-600">
      {show ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      )}
    </button>
  );

  const InputField = ({ label, name, type = "text", placeholder, icon, rightElement }) => (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1 block" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {label}
      </label>
      <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 gap-2 focus-within:border-green-600 transition-colors">
        {icon}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={form[name]}
          onChange={handleChange}
          className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        />
        {rightElement}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Green Header Banner */}
        <div
          className="h-24 w-full relative flex items-end justify-center pb-2"
          style={{
            background: "linear-gradient(135deg, #1B5E20, #2E7D32, #388E3C)",
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-2 right-4 w-16 h-16 rounded-full opacity-10 bg-white" />
          <div className="absolute bottom-2 left-4 w-10 h-10 rounded-full opacity-10 bg-white" />
          <div className="absolute top-4 left-1/3 w-8 h-8 rounded-full opacity-5 bg-white" />
        </div>

        <div className="px-7 pb-7">
          {/* Logo overlapping banner */}
          <div className="flex flex-col items-center -mt-8 mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md border-2 border-white" style={{ backgroundColor: "#2E7D32" }}>
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <h1 className="text-lg font-bold text-gray-800 mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>MyTalipapa</h1>
            <p className="text-xs text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>Create your renter account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Full Name */}
            <InputField
              label="Full Name"
              name="fullName"
              placeholder="Juan Dela Cruz"
              icon={
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              rightElement={
                form.fullName && (
                  <button type="button" onClick={() => setForm({ ...form, fullName: "" })} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )
              }
            />

            {/* Contact Number */}
            <InputField
              label="Contact Number"
              name="contactNumber"
              placeholder="(+63) 945 6789"
              icon={
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
              rightElement={
                form.contactNumber && (
                  <button type="button" onClick={() => setForm({ ...form, contactNumber: "" })} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )
              }
            />

            {/* Email */}
            <InputField
              label="Email Address"
              name="emailAddress"
              type="email"
              placeholder="juan@mytalipapa.ph"
              icon={
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              rightElement={
                form.emailAddress && (
                  <button type="button" onClick={() => setForm({ ...form, emailAddress: "" })} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )
              }
            />

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Password</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 gap-2 focus-within:border-green-600 transition-colors">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
                <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Confirm Password</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 gap-2 focus-within:border-green-600 transition-colors">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
                <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 accent-green-700 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                I agree to the{" "}
                <a href="#" className="font-semibold underline" style={{ color: "#2E7D32" }}>Terms</a>
                {" "}and{" "}
                <a href="#" className="font-semibold underline" style={{ color: "#2E7D32" }}>Privacy Policy</a>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 mt-2"
              style={{ backgroundColor: "#2E7D32", fontFamily: "'Poppins', sans-serif" }}
            >
              Register
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-xs text-gray-500 mt-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Already have an account?{" "}
            <a href="/login" className="font-semibold" style={{ color: "#2E7D32" }}>Login</a>
          </p>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            © 2024 MyTalipapa Market Management. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}