"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabaseClient";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optionally, redirect if not a recovery flow
    if (typeof window !== 'undefined' && !window.location.hash.includes("type=recovery")) {
      setError("Invalid or expired password reset link.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password || password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const supabase = getSupabase();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.replace("/admin");
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Reset Your Password
        </h2>
        {error && <div className="text-red-600 text-center mb-2">{error}</div>}
        {success ? (
          <div className="text-green-600 text-center">Password updated! Redirecting...</div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-semibold transition-colors"
              disabled={loading}
            >
              {loading ? "Updating..." : "Set New Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
