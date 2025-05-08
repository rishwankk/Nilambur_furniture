"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type FormData = {
  username: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);


  useEffect(() => {
    setMounted(true);
    const token=localStorage.getItem('adminToken');
    setToken(token);

    if (token) {
      router.replace('/admin');
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
              'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store token in cookies (so middleware can read it)
        Cookies.set('adminToken', data.token, { expires: 1, path: '/' });
        localStorage.setItem('adminToken', data.token);

        // Redirect to admin
        router.push("/admin");
      } else {
        setLoginError(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError("Something went wrong. Please try again.");
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setLoginError("");
    await handleLogin(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-96 p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1">Username</label>
            <input
              id="username"
              type="text"
              {...register("username", { required: "Username is required" })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">Password</label>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          {loginError && (
            <p className="text-red-500 text-sm">{loginError}</p>
          )}
          <button
            type="submit"
            className={`w-full py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
