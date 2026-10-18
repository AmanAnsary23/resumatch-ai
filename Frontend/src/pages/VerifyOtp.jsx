import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileText, LoaderCircle, MailCheck } from "lucide-react";
import { verifyOtp, resendOtp } from "../services/auth.service";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      await verifyOtp({ email: email.trim().toLowerCase(), otp });
      setMessage("Email verified successfully!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setResending(true);
      await resendOtp({ email: email.trim().toLowerCase() });
      setCountdown(60);
      setOtp("");
      setMessage("A new OTP has been sent to your email.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link
          to="/register"
          className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold text-slate-900"
        >
          <FileText className="h-7 w-7 text-indigo-600" />
          ResuMatch AI
        </Link>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
            <MailCheck className="h-7 w-7 text-indigo-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Verify your email
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter the 6-digit OTP sent to your email address.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              6-digit OTP
            </label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter OTP"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="text-sm text-green-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <LoaderCircle className="h-5 w-5 animate-spin" />}
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Didn't receive the OTP?
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || resending}
            className="ml-2 font-semibold text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {resending
              ? "Sending..."
              : countdown > 0
                ? `Resend in ${countdown}s`
                : "Resend OTP"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already verified?{" "}
          <Link to="/login" className="font-semibold text-indigo-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}