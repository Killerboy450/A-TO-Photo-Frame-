/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { Lock, Mail, User, ShieldCheck, Landmark, Check, AlertCircle, RefreshCw } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, signUpWithEmail } = useFirebase();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Feedback states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please specify both your email address and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        if (!name.trim()) {
          setErrorMsg('Please state your full name to set up your customer account.');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email.trim(), password, name.trim());
        setSuccessMsg('Customer account registered successfully! Entering showroom...');
      } else {
        await loginWithEmail(email.trim(), password);
        setSuccessMsg('Signing in and opening dashboard...');
      }
    } catch (err: any) {
      console.error(err);
      let message = 'Vapi Auth Server: Credentials match failed.';
      if (err.code === 'auth/wrong-password') {
        message = 'Specified password is not correct.';
      } else if (err.code === 'auth/user-not-found') {
        message = 'No account matches this email register. Toggle to "Create Account" below!';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'An account with this email address is already registered.';
      } else if (err.message && err.message.includes('INVALID_LOGIN_CREDENTIALS')) {
        message = 'Invalid email or password mismatch. Please try again.';
      } else if (err.message) {
        message = err.message;
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill helper command for testers/admin
  const handlePrefillAdmin = () => {
    setEmail('hasansodawala786@gmail.com');
    setPassword('123456');
    setIsSignUp(false);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Decorative ambient blurred orb accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-650/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card panel */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-slate-850/40 backdrop-blur-xl border border-slate-750 p-8 shadow-2xl transition-all">
        
        {/* Brand identity header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
            <Landmark size={28} className="stroke-[1.75]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              A to Z Photo Frame
            </h1>
            <p className="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold mt-1">
              Vapi Showroom Gateway
            </p>
          </div>
        </div>


        {/* Feedback alerts */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2 text-left animate-fadeIn">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 text-left animate-fadeIn">
            <Check size={15} className="shrink-0" />
            <span className="font-bold font-mono">{successMsg}</span>
          </div>
        )}

        {/* Main interactive form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {isSignUp && (
            <div className="space-y-1.5">
              <label htmlFor="loginName" className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Your Full Name
              </label>
              <div className="relative">
                <input
                  id="loginName"
                  type="text"
                  required
                  placeholder="e.g. Hasan Sodawala"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 focus:border-amber-500 text-white rounded-xl py-3 pl-10 pr-4 outline-none transition-all placeholder:text-slate-500 shadow-inner"
                />
                <User size={14} className="text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="loginEmail" className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Email Address
            </label>
            <div className="relative">
              <input
                id="loginEmail"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-slate-900 border border-slate-700 focus:border-amber-500 text-white rounded-xl py-3 pl-10 pr-4 outline-none transition-all placeholder:text-slate-500 shadow-inner"
              />
              <Mail size={14} className="text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="loginPassword" className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Password
            </label>
            <div className="relative">
              <input
                id="loginPassword"
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs bg-slate-900 border border-slate-700 focus:border-amber-500 text-white rounded-xl py-3 pl-10 pr-4 outline-none transition-all placeholder:text-slate-500 shadow-inner"
              />
              <Lock size={14} className="text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 py-3.5 text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-amber-500/10 transition-all duration-200 mt-6"
          >
            {loading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <span>{isSignUp ? 'Create Showroom Account' : 'Secure Sign In'}</span>
            )}
          </button>
        </form>

        {/* Third-party Sign In Divider block */}
        <div className="relative my-6 text-center select-none">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-850" />
          </div>
          <span className="relative bg-slate-900 px-3 text-[10px] uppercase font-mono tracking-widest text-slate-500">
            or connect with
          </span>
        </div>

        {/* Third Party Google Sign In button */}
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 py-3 text-xs font-semibold cursor-pointer transition-all duration-200"
        >
          {/* Flat stylized Google G Icon SVG */}
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Toggling Auth state link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="text-xs font-bold text-amber-500 hover:text-amber-400 font-mono tracking-wide cursor-pointer underline-offset-4 hover:underline"
          >
            {isSignUp ? 'Already registered? Log In here' : 'New client? Set up account'}
          </button>
        </div>

      </div>
    </div>
  );
};
