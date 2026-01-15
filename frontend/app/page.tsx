'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link for navigation
import api, { removeToken } from '../utils/api';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        // User not logged in, remain on landing page
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('role');
    setUser(null);
    // Optional: Only push if we want to reset state or url params
    // router.push('/'); 
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-950 text-white">Loading...</div>;
  }

  // Authenticated View: Dashboard
  if (user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-4">
        <div className="max-w-3xl w-full text-center space-y-8">
          <h1 className="text-6xl font-extrabold tracking-tight">
            Welcome <span className={user.role === 'admin' ? "text-red-500" : "text-blue-500"}>
              {user.role === 'admin' ? 'Admin' : 'User'}
            </span>
          </h1>

          <p className="text-xl text-gray-400">
            You are logged in as <span className="font-mono text-white">{user.email}</span>
          </p>

          <div className="pt-8">
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-full text-lg font-semibold transition ring-1 ring-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated View: Welcome / Landing Page
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="z-10 text-center space-y-12 p-8 animate-fade-in">
        {/* Title */}
        <h1 className="text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-2xl">
          Smarteam
        </h1>

        <p className="text-2xl text-gray-300 font-light max-w-lg mx-auto">
          The smart way to manage your team and projects effortlessly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8">
          <Link href="/login">
            <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30 w-48">
              Login
            </button>
          </Link>

          <Link href="/register">
            <button className="px-10 py-4 bg-gray-800/80 hover:bg-gray-800 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 border border-gray-700 backdrop-blur-sm w-48">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
