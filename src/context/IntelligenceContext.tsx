import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Suspect, type Case, KSP_SUSPECTS, KSP_CASES } from '../mockData/intelligenceDb';

export type ModuleType =
  | 'command-center'
  | 'ai-assistant'
  | 'network-intel'
  | 'geospatial-intel'
  | 'forecasting'
  | 'case-workspace'
  | 'financial-crime'
  | 'behavioral-profiling'
  | 'executive-center'
  | 'security-config';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  confidence?: number;
  evidence?: string[];
  reasoningSteps?: string[];
  sources?: string[];
  suggestedActions?: string[];
}

export interface SystemAlert {
  id: string;
  timestamp: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL';
  district: string;
}

interface IntelligenceContextProps {
  currentModule: ModuleType;
  setCurrentModule: (module: ModuleType) => void;
  selectedSuspect: Suspect | null;
  setSelectedSuspect: (suspect: Suspect | null) => void;
  selectedCase: Case | null;
  setSelectedCase: (c: Case | null) => void;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  sendChatMessage: (message: string) => void;
  systemAlerts: SystemAlert[];
  addSystemAlert: (alert: Omit<SystemAlert, 'id' | 'timestamp'>) => void;
  userRole: 'DGP' | 'INSPECTOR' | 'CONSTABLE';
  setUserRole: (role: 'DGP' | 'INSPECTOR' | 'CONSTABLE') => void;
  globalThreatScore: number;
  isAuthenticated: boolean;
  isVerifying2FA: boolean;
  currentUser: { name: string; email: string; phone: string; role: 'DGP' | 'INSPECTOR' | 'CONSTABLE' } | null;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string, email: string, phone: string, role: 'DGP' | 'INSPECTOR' | 'CONSTABLE') => Promise<void>;
  verify2FA: (otpCode: string) => boolean;
  logoutUser: () => void;
  initiateGoogleLogin: (email: string, name: string) => void;
}

const IntelligenceContext = createContext<IntelligenceContextProps | undefined>(undefined);

export const useIntelligence = () => {
  const context = useContext(IntelligenceContext);
  if (!context) {
    throw new Error('useIntelligence must be used within an IntelligenceProvider');
  }
  return context;
};

export const IntelligenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentModule, setCurrentModule] = useState<ModuleType>('command-center');
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(KSP_SUSPECTS[0]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(KSP_CASES[0]);
  const [userRole, setUserRole] = useState<'DGP' | 'INSPECTOR' | 'CONSTABLE'>('DGP');
  const [globalThreatScore, setGlobalThreatScore] = useState(82);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone: string; role: 'DGP' | 'INSPECTOR' | 'CONSTABLE' } | null>(null);
  const [tempUser, setTempUser] = useState<{ name: string; email: string; phone: string; role: 'DGP' | 'INSPECTOR' | 'CONSTABLE' } | null>(null);
  const [generatedOTP, setGeneratedOTP] = useState('');

  // Pre-seed some chat logs
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg_0',
      sender: 'ai',
      text: 'Secure link established. CrimeVision AI Agent Core online. Standing by for KSP intelligence queries.',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  // Pre-seed system alerts
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([
    { id: 'al_1', timestamp: '20:45:12', message: 'Simulated suspicious transactions flagged in Ocean Tech Axis bank account.', type: 'WARNING', district: 'Bengaluru City' },
    { id: 'al_2', timestamp: '20:49:03', message: 'Kolar sand truck (KA-07-T-4552) registered movement past Hosur checkpost.', type: 'INFO', district: 'Tumakuru Range' },
    { id: 'al_3', timestamp: '20:53:40', message: 'Critical spoofing email attempt detected on State Treasury server. Blocked.', type: 'CRITICAL', district: 'Bengaluru City' },
    { id: 'al_4', timestamp: '20:56:15', message: 'Offender under surveillance "Tech Murali" cell pinged near Jayanagar sector 4.', type: 'WARNING', district: 'Bengaluru City' }
  ]);

  // Periodic alert simulator to make the app feel alive and responsive
  useEffect(() => {
    const alertMessages = [
      { message: 'Alert: Financial smurfing detected. 6 micro-transfers to crypto node.', type: 'WARNING' as const, district: 'Dakshina Kannada (Mangaluru)' },
      { message: 'Notice: Case KSP/2026/CY-0891 status updated to "Evidence Correlated".', type: 'INFO' as const, district: 'Bengaluru City' },
      { message: 'Critical threat alert: Anomaly score spiked in Mysuru region (cyber theft surge).', type: 'CRITICAL' as const, district: 'Mysuru District' },
      { message: 'Notice: JCB Loader KA-07-M-2201 vehicle tracker updated near Kolar riverbed.', type: 'INFO' as const, district: 'Tumakuru Range' },
      { message: 'Alert: Heavy encrypted VPN flow identified targeting Dharwad local police server.', type: 'WARNING' as const, district: 'Dharwad (Hubballi)' }
    ];

    const interval = setInterval(() => {
      const randomAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setSystemAlerts(prev => [
        {
          id: `al_${Date.now()}`,
          timestamp: timeStr,
          message: randomAlert.message,
          type: randomAlert.type,
          district: randomAlert.district
        },
        ...prev.slice(0, 19) // Keep last 20
      ]);

      // Modulate threat score slightly
      setGlobalThreatScore(prev => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
        return Math.max(70, Math.min(95, prev + delta));
      });
    }, 18000); // Trigger every 18 seconds

    return () => clearInterval(interval);
  }, []);

  const addSystemAlert = (alert: Omit<SystemAlert, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSystemAlerts(prev => [
      {
        ...alert,
        id: `al_${Date.now()}`,
        timestamp: timeStr
      },
      ...prev
    ]);
  };

  const loginUser = async (email: string, password: string) => {
    // Simple validation, set role based on mock rules
    if (!password) return false;
    let role: 'DGP' | 'INSPECTOR' | 'CONSTABLE' = 'INSPECTOR';
    if (email.toLowerCase().includes('dgp') || email.toLowerCase().includes('commissioner')) {
      role = 'DGP';
    } else if (email.toLowerCase().includes('constable') || email.toLowerCase().includes('beat')) {
      role = 'CONSTABLE';
    }

    const mockUser = {
      name: email.split('@')[0].toUpperCase(),
      email,
      phone: '+91 94408 12345',
      role
    };

    setTempUser(mockUser);
    
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    setIsVerifying2FA(true);
    
    // Alert the user with the generated code
    setTimeout(() => {
      alert(`[CRIMEVISION SECURITY] OTP Code sent to KSP Mobile (+91-94408-12345): ${otp}`);
    }, 500);

    return true;
  };

  const registerUser = async (name: string, email: string, phone: string, role: 'DGP' | 'INSPECTOR' | 'CONSTABLE') => {
    const mockUser = { name, email, phone, role };
    setTempUser(mockUser);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    setIsVerifying2FA(true);

    setTimeout(() => {
      alert(`[CRIMEVISION SECURITY] OTP Code sent to ${email}: ${otp}`);
    }, 500);
  };

  const initiateGoogleLogin = (email: string, name: string) => {
    let role: 'DGP' | 'INSPECTOR' | 'CONSTABLE' = 'INSPECTOR';
    if (email.toLowerCase().includes('dgp') || email.toLowerCase().includes('commissioner')) {
      role = 'DGP';
    }
    const mockUser = { name, email, phone: '+91 98860 11029', role };
    setTempUser(mockUser);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    setIsVerifying2FA(true);

    setTimeout(() => {
      alert(`[CRIMEVISION SECURITY] Google account authenticated. 2-Step OTP Code sent: ${otp}`);
    }, 500);
  };

  const verify2FA = (otpCode: string) => {
    if (otpCode === generatedOTP || otpCode === '123456') { // Allow fallback code
      setIsAuthenticated(true);
      setIsVerifying2FA(false);
      if (tempUser) {
        setCurrentUser(tempUser);
        setUserRole(tempUser.role);
      }
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setIsVerifying2FA(false);
    setCurrentUser(null);
    setTempUser(null);
  };

  const sendChatMessage = (message: string) => {
    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);

    // Generate intelligent AI response based on query keywords
    setTimeout(() => {
      let aiText = '';
      let confidence = 94;
      let evidence: string[] = [];
      let reasoningSteps: string[] = [];
      let sources: string[] = [];
      let suggestedActions: string[] = [];

      const query = message.toLowerCase();

      if (query.includes('repeat offender') || query.includes('offender') || query.includes('murali')) {
        aiText = 'Retrieving Repeat Offender profiles. Located Murali Mohan (alias "Tech Murali"), active leader of the Bengaluru Digital Syndicate. He is currently linked to 2 open cases involving cyber fraud and ransomware (Wipro Park Breach, Bellandur software firm raid). His direct financial washer is Aditi Rao (Crypto Queen), and they share communication links via encrypted burners.';
        confidence = 96;
        evidence = [
          '42 recorded phone calls between +91 98860 12104 (Murali) and +91 99000 45451 (Aditi) in May 2026.',
          'Direct bank transfers of ₹15,00,000 from Murali\'s HDFC account to Aditi\'s AXIS account on 2026-05-13.'
        ];
        reasoningSteps = [
          'Identify keyword "offenders" and locate matches in suspect registry.',
          'Cross-reference "Murali Mohan" with existing cases and call log metadata.',
          'Perform PageRank score lookup: Murali is high central node (PageRank: 0.28).',
          'Assess association strength with secondary node (Aditi Rao): High financial & communication link weight (score 8/10).'
        ];
        sources = ['KSP Suspect Registry (#S-01)', 'Call Data Record (CDR) database', 'Axis Bank Transaction Ledger'];
        suggestedActions = [
          'Deploy intercept vehicle to Jayanagar Sector 4 cell-tower circle.',
          'Issue freezing order on Axis Bank account AXIS-9921029102.',
          'Request custodial interrogation warrant for co-accused Aditi Rao.'
        ];
      } else if (query.includes('theft') || query.includes('vehicle') || query.includes('phone') || query.includes('connect')) {
        aiText = 'Analyzing network links. Traced physical connections mapping suspect Rudresh Gowda (JCB Rudra) to illegal sand mining transport trucks. His phone records show active coordinates mapping to Kolar riverbeds, which directly match timestamps of illegal mineral extractions. A phone call trail connects his loaders to tech-scam conduits in Bengaluru.';
        confidence = 88;
        evidence = [
          'Truck tracker KA-07-T-4552 matching illegal mining activity times at 04:00 AM.',
          'Call records show communications between Rudresh Gowda burner SIM and Murali Mohan burner SIM.'
        ];
        reasoningSteps = [
          'Search asset registry for vehicles matching "KA-07".',
          'Extract ownership links: matches "Rudresh Gowda".',
          'Map geospatial pings of suspect mobile phones to sand collection areas.',
          'Determine shortest path: Rudresh Gowda -> Vehicle -> Location (Kolar) -> Co-conspirator.'
        ];
        sources = ['KSP Transport Vahan Registry', 'Kolar Circle Mobile Pings', 'Case File KSP/2026/LS-4012'];
        suggestedActions = [
          'Seize tipper truck KA-07-T-4552 at district border check-post.',
          'Intercept communications on burner phone +91 98450 78201.'
        ];
      } else if (query.includes('district') || query.includes('spike') || query.includes('next month') || query.includes('forecast')) {
        aiText = 'Forecasting model execution. Model XGBoost (v2.4) predicts a high risk of cybercrime surges (+14%) in Bengaluru City and Mysuru District next month, fueled by digital token volatility and high corporate hiring spikes. Anomaly scores in Kalaburagi suggest a parallel rise in property disputes due to sand mining seasonal halts.';
        confidence = 91;
        evidence = [
          'Cybercrime baseline trends up from 3,500 to 4,210 cases (+20.2% YoY).',
          'Socioeconomic factor inputs: corporate expansion combined with unregulated freelance growth.'
        ];
        reasoningSteps = [
          'Invoke XGBoost time-series forecasting model with 12-month historical inputs.',
          'Apply LIME explanation to identify top weights: historical crime rate (0.45), temperature/seasonal index (0.21), bank fraud frequency (0.18).',
          'Evaluate confidence score: Mean Absolute Percentage Error (MAPE) of model is 4.8%.'
        ];
        sources = ['KSP Historical Crime Logs (2020-2026)', 'Karnataka Meteorological Bureau', 'RBI Fraud Database'];
        suggestedActions = [
          'Re-allocate 12 cyber specialists from Shivamogga to Koramangala Cyber Crime PS.',
          'Deploy tactical highway patrols on Kolar-Bengaluru route.'
        ];
      } else {
        aiText = `Search query processed. Found matches in KSP Database: 4 active suspects and 4 open investigations under district surveillance. Command Center threat index is currently evaluated at ${globalThreatScore}%. What specific node (Suspect, Vehicle, Bank account, or Case Number) do you want to analyze?`;
        confidence = 95;
        evidence = ['Database scan: 18 district nodes evaluated.'];
        reasoningSteps = ['Tokenize query.', 'Match tokens with database keys.', 'Select nearest matching semantic nodes.'];
        sources = ['KSP Active Crime Index'];
        suggestedActions = ['Refine search using suspect names (e.g., "Murali Mohan" or "Rudresh Gowda").', 'Toggle the Geospatial Intelligence layer to view crime densities.'];
      }

      const aiMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence,
        evidence,
        reasoningSteps,
        sources,
        suggestedActions
      };

      setChatHistory(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <IntelligenceContext.Provider
      value={{
        currentModule,
        setCurrentModule,
        selectedSuspect,
        setSelectedSuspect,
        selectedCase,
        setSelectedCase,
        chatHistory,
        setChatHistory,
        sendChatMessage,
        systemAlerts,
        addSystemAlert,
        userRole,
        setUserRole,
        globalThreatScore,
        isAuthenticated,
        isVerifying2FA,
        currentUser,
        loginUser,
        registerUser,
        verify2FA,
        logoutUser,
        initiateGoogleLogin
      }}
    >
      {children}
    </IntelligenceContext.Provider>
  );
};
