import React, { useState, useEffect } from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { Shield, Key, Mail, Phone, User, Sliders, Smartphone, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export const LoginPortal: React.FC = () => {
  const { loginUser, registerUser, verify2FA, initiateGoogleLogin, isVerifying2FA, logoutUser } = useIntelligence();

  // Mode tabs: 'signin' | 'signup' | 'google-modal'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<'DGP' | 'INSPECTOR' | 'CONSTABLE'>('INSPECTOR');

  // 2FA inputs
  const [otpCode, setOtpCode] = useState('');
  const [otpChannel, setOtpChannel] = useState<'sms' | 'email'>('sms');
  const [timer, setTimer] = useState(30);
  const [errorMsg, setErrorMsg] = useState('');

  // 2FA Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isVerifying2FA && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVerifying2FA, timer]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please input valid officer credentials.');
      return;
    }
    setErrorMsg('');
    await loginUser(email, password);
    setTimer(30);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('All registration fields are required.');
      return;
    }
    setErrorMsg('');
    await registerUser(name, email, phone, selectedRole);
    setTimer(30);
  };

  const handleGoogleAccountSelect = (googleEmail: string, googleName: string) => {
    setShowGoogleModal(false);
    setErrorMsg('');
    initiateGoogleLogin(googleEmail, googleName);
    setTimer(30);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setErrorMsg('Please enter a 6-digit verification code.');
      return;
    }
    const success = verify2FA(otpCode);
    if (!success) {
      setErrorMsg('Invalid authorization code. Please try again.');
    } else {
      setErrorMsg('');
      setOtpCode('');
    }
  };

  const handleResendOTP = () => {
    setTimer(30);
    setErrorMsg('');
    // Trigger login again to push new alert code
    if (authMode === 'signin') {
      loginUser(email || 'ADMIN@KSP.GOV.IN', password);
    } else {
      registerUser(name, email, phone, selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-ksp-bg relative flex items-center justify-center p-4 overflow-hidden selection:bg-ksp-primary/30">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-ksp-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-ksp-danger/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>

      {/* Main portal box */}
      <div className="w-full max-w-md bg-ksp-surface/80 backdrop-blur-xl border border-gray-800 shadow-glass rounded-2xl p-6 sm:p-8 relative z-10 flex flex-col justify-between min-h-[500px]">
        {/* Header Branding */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-ksp-primary to-ksp-accent rounded-2xl flex items-center justify-center text-white mx-auto shadow-neon-blue border border-ksp-primary/40">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl text-white tracking-wider">CRIMEVISION AI</h1>
            <p className="text-[10px] font-mono text-ksp-accent uppercase tracking-wider font-semibold">KSP Zero-Trust Entry Portal</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-ksp-danger/10 border border-ksp-danger/30 rounded-lg text-xs text-red-200 flex items-start gap-2 animate-bounce">
            <AlertTriangle className="h-4 w-4 text-ksp-danger flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dynamic flow routing */}
        {!isVerifying2FA ? (
          <div className="space-y-6">
            {/* Tab Swither */}
            <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-900 text-xs font-mono">
              <button
                onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-md transition ${authMode === 'signin' ? 'bg-ksp-primary/15 border border-ksp-primary/30 text-white font-bold' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Officer Sign In
              </button>
              <button
                onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-md transition ${authMode === 'signup' ? 'bg-ksp-primary/15 border border-ksp-primary/30 text-white font-bold' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Register Credentials
              </button>
            </div>

            {/* Standard Sign In Form */}
            {authMode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5 relative">
                  <span className="text-[10px] font-mono text-ksp-muted font-bold uppercase tracking-wider">KSP Email</span>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. shivaraj.dgp@ksp.gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-950 text-xs sm:text-sm text-gray-200 border border-gray-850 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-ksp-primary font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 relative">
                  <span className="text-[10px] font-mono text-ksp-muted font-bold uppercase tracking-wider">Passphrase</span>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-950 text-xs sm:text-sm text-gray-200 border border-gray-850 rounded-lg pl-10 pr-10 py-3 outline-none focus:border-ksp-primary font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-ksp-primary hover:bg-ksp-primary/80 text-white font-mono text-xs font-bold py-3.5 rounded-lg shadow-neon-blue transition"
                >
                  Initiate Secure Sign In
                </button>
              </form>
            ) : (
              /* Registration Form */
              <form onSubmit={handleSignUp} className="space-y-3.5">
                {/* Full name */}
                <div className="space-y-1 relative">
                  <span className="text-[10px] font-mono text-ksp-muted font-bold uppercase tracking-wider">Officer Full Name</span>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. DGP SHIVARAJ"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-950 text-xs text-gray-200 border border-gray-850 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-ksp-primary font-sans"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1 relative">
                  <span className="text-[10px] font-mono text-ksp-muted font-bold uppercase tracking-wider">Official KSP Email</span>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. address@ksp.gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-950 text-xs text-gray-200 border border-gray-850 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-ksp-primary font-sans"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1 relative">
                  <span className="text-[10px] font-mono text-ksp-muted font-bold uppercase tracking-wider">Registered Mobile</span>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 94480 11020"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-950 text-xs text-gray-200 border border-gray-850 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-ksp-primary font-sans"
                    />
                  </div>
                </div>

                {/* Role select */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-ksp-muted font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sliders className="h-3 w-3 text-ksp-accent" /> Assigned Clearance Role
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('DGP')}
                      className={`py-2 rounded border transition ${selectedRole === 'DGP' ? 'bg-ksp-danger/10 border-ksp-danger text-red-200 font-bold' : 'bg-gray-950 border-gray-850 text-gray-400'}`}
                    >
                      DGP (L3)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('INSPECTOR')}
                      className={`py-2 rounded border transition ${selectedRole === 'INSPECTOR' ? 'bg-ksp-accent/10 border-ksp-accent text-white font-bold' : 'bg-gray-950 border-gray-850 text-gray-400'}`}
                    >
                      Inspector (L2)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('CONSTABLE')}
                      className={`py-2 rounded border transition ${selectedRole === 'CONSTABLE' ? 'bg-ksp-warning/10 border-ksp-warning text-white font-bold' : 'bg-gray-950 border-gray-850 text-gray-400'}`}
                    >
                      Constable (L1)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-ksp-accent hover:bg-ksp-accent/80 text-white font-mono text-xs font-bold py-3.5 rounded-lg shadow-neon-cyan transition mt-2"
                >
                  Register Profile
                </button>
              </form>
            )}

            {/* Google Sign-in Mock button */}
            <div className="relative flex items-center justify-center my-4 border-t border-gray-850">
              <span className="bg-[#111827] px-3 py-1 text-[9px] font-mono text-ksp-muted absolute">OR ACCESS VIA PROVIDERS</span>
            </div>

            <button
              onClick={() => setShowGoogleModal(true)}
              className="w-full bg-gray-950 hover:bg-gray-900 border border-gray-800 py-3 rounded-lg flex items-center justify-center gap-3 text-xs text-gray-200 transition"
            >
              {/* Google Colored Icon Logo */}
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Verify credentials with Google SSO</span>
            </button>
          </div>
        ) : (
          /* 2FA Keypad screen */
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="text-center space-y-1.5">
              <span className="text-[10px] font-mono text-ksp-accent uppercase tracking-wider font-semibold bg-ksp-accent/10 border border-ksp-accent/30 px-2.5 py-0.5 rounded-full inline-block">
                2-Step Authentication Shield
              </span>
              <p className="text-xs text-gray-300">A verification code has been dispatched to KSP records via your chosen channel.</p>
            </div>

            {/* OTP Channel Selector */}
            <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-900 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setOtpChannel('sms')}
                className={`flex-1 py-1.5 rounded transition flex items-center justify-center gap-1.5 ${otpChannel === 'sms' ? 'bg-gray-900 border border-gray-800 text-white font-bold' : 'text-gray-400'}`}
              >
                <Smartphone className="h-3.5 w-3.5" /> SMS to Mobile
              </button>
              <button
                type="button"
                onClick={() => setOtpChannel('email')}
                className={`flex-1 py-1.5 rounded transition flex items-center justify-center gap-1.5 ${otpChannel === 'email' ? 'bg-gray-900 border border-gray-800 text-white font-bold' : 'text-gray-400'}`}
              >
                <Mail className="h-3.5 w-3.5" /> KSP Secure Mail
              </button>
            </div>

            {/* Input field */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-ksp-muted font-bold uppercase tracking-wider block text-center">Enter 6-Digit Telemetry Code</span>
              <input
                type="text"
                maxLength={6}
                placeholder="######"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[12px] bg-gray-950 text-xl font-bold font-mono text-ksp-accent border border-gray-805 focus:border-ksp-accent rounded-lg py-3 outline-none"
              />
            </div>

            {/* Resend and abort links */}
            <div className="flex justify-between items-center text-xs font-mono">
              {timer > 0 ? (
                <span className="text-ksp-muted">Resend OTP in: <span className="text-white font-bold">{timer}s</span></span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-ksp-accent hover:underline font-bold"
                >
                  Resend Telemetry OTP
                </button>
              )}
              <button
                type="button"
                onClick={logoutUser}
                className="text-ksp-danger hover:underline"
              >
                Abort Log In
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-ksp-success hover:bg-ksp-success/80 text-white font-mono text-xs font-bold py-3.5 rounded-lg shadow-neon-blue transition"
            >
              Verify Code & Authorize Access
            </button>
          </form>
        )}

        {/* Footer Zero Trust note */}
        <div className="mt-8 text-center text-[9px] font-mono text-ksp-muted leading-relaxed uppercase border-t border-gray-850 pt-4 opacity-70">
          State Information Security Directive Compliance. Access monitored under Zero-Trust protocols. IP logged at central server.
        </div>
      </div>

      {/* Google SSO Accounts Picker Overlay Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-glass space-y-4">
            <div className="text-center space-y-1">
              <svg className="h-8 w-8 mx-auto" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <h3 className="font-bold text-sm text-white font-sans mt-2">Choose KSP Google Account</h3>
              <p className="text-[10px] text-ksp-muted font-mono">Must map to an authorized police directory</p>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              <button
                onClick={() => handleGoogleAccountSelect('shivaraj.dgp@ksp.gov.in', 'DGP SHIVARAJ')}
                className="w-full p-3 bg-gray-950 hover:bg-gray-800 border border-gray-850 rounded-lg text-left transition flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-red-950 flex items-center justify-center font-bold text-red-200 text-xs flex-shrink-0">S</div>
                <div className="min-w-0 text-xs">
                  <span className="font-bold text-gray-200 block">DGP SHIVARAJ</span>
                  <span className="text-[10px] text-ksp-muted block">shivaraj.dgp@ksp.gov.in (DGP Clearance)</span>
                </div>
              </button>

              <button
                onClick={() => handleGoogleAccountSelect('asha.kiran@ksp.gov.in', 'INSP ASHA KIRAN')}
                className="w-full p-3 bg-gray-950 hover:bg-gray-800 border border-gray-850 rounded-lg text-left transition flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-950 flex items-center justify-center font-bold text-cyan-200 text-xs flex-shrink-0">A</div>
                <div className="min-w-0 text-xs">
                  <span className="font-bold text-gray-200 block">INSP ASHA KIRAN</span>
                  <span className="text-[10px] text-ksp-muted block">asha.kiran@ksp.gov.in (Inspector L2)</span>
                </div>
              </button>

              <button
                onClick={() => handleGoogleAccountSelect('vinay.constable@ksp.gov.in', 'PC VINAY KUMAR')}
                className="w-full p-3 bg-gray-950 hover:bg-gray-800 border border-gray-850 rounded-lg text-left transition flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-amber-950 flex items-center justify-center font-bold text-amber-200 text-xs flex-shrink-0">V</div>
                <div className="min-w-0 text-xs">
                  <span className="font-bold text-gray-200 block">PC VINAY KUMAR</span>
                  <span className="text-[10px] text-ksp-muted block">vinay.constable@ksp.gov.in (Constable L1)</span>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowGoogleModal(false)}
              className="w-full text-xs font-mono text-center text-ksp-danger hover:underline mt-2"
            >
              Cancel Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
