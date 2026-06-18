// Karnataka State Police (KSP) Crime Intelligence Mock Database

export interface DistrictData {
  id: string;
  name: string;
  threatIndex: number; // 1 to 100
  policeStationsCount: number;
  totalCrimes2026: number;
  unresolvedCases: number;
  riskCategory: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  lat: number; // Approximate relative SVG coordinates
  lng: number; // Relative coordinate
  path: string; // SVG path representation (approximate relative points)
  hotspotsCount: number;
  cyberCrimes: number;
  financialCrimes: number;
  violentCrimes: number;
  propertyCrimes: number;
}

export interface Suspect {
  id: string;
  name: string;
  aliases: string;
  age: number;
  threatScore: number; // 1 to 100
  recidivismScore: number; // percentage
  status: 'ACTIVE' | 'INCARCERATED' | 'UNDER_SURVEILLANCE' | 'ABSCONDING';
  primaryCrimeType: string;
  modusOperandi: string;
  operatingHours: string;
  targetPreference: string;
  geographicPreference: string;
  psychologicalIndicators: string[];
  networkInfluence: 'HIGH' | 'MEDIUM' | 'LOW';
  activeCases: string[]; // Case IDs
  phoneNumbers: string[];
  vehicles: string[];
  bankAccounts: string[];
  narrativeSummary: string;
  associatedGangs: string[];
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  type: string;
  district: string;
  station: string;
  reportedDate: string;
  status: 'INVESTIGATING' | 'CHARGE_SHEETED' | 'COLD' | 'CLOSED';
  suspectsLinked: string[]; // Suspect IDs
  evidenceItems: { id: string; name: string; type: string; confidence: number; dateFound: string }[];
  timeline: { date: string; title: string; description: string; officer: string }[];
  summary: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  similarityScore?: number;
}

export interface Transaction {
  id: string;
  senderAccount: string;
  senderName: string;
  receiverAccount: string;
  receiverName: string;
  amount: number; // INR
  date: string;
  riskScore: number;
  flags: string[];
  type: 'SHELL_COMPANY' | 'HAWALA' | 'CROSS_BORDER' | 'LOCAL_SMURFI';
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'suspect' | 'phone' | 'vehicle' | 'bank' | 'location' | 'case' | 'weapon';
  riskScore: number; // 0 to 100
  subtitle?: string;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: 'communication' | 'financial' | 'co_accused' | 'location_match' | 'ownership' | 'family' | 'travel';
  weight: number; // 1 to 10
  label?: string;
}

// -------------------------------------------------------------
// SEED DATA REPRESENTATION
// -------------------------------------------------------------

export const KSP_DISTRICTS: DistrictData[] = [
  {
    id: 'bengaluru_city',
    name: 'Bengaluru City',
    threatIndex: 94,
    policeStationsCount: 108,
    totalCrimes2026: 12450,
    unresolvedCases: 3410,
    riskCategory: 'CRITICAL',
    lat: 280, lng: 250,
    path: 'M 260,240 L 290,230 L 300,260 L 270,270 Z',
    hotspotsCount: 18,
    cyberCrimes: 4210,
    financialCrimes: 2890,
    violentCrimes: 1850,
    propertyCrimes: 3500
  },
  {
    id: 'mysuru',
    name: 'Mysuru District',
    threatIndex: 68,
    policeStationsCount: 32,
    totalCrimes2026: 4120,
    unresolvedCases: 980,
    riskCategory: 'HIGH',
    lat: 250, lng: 300,
    path: 'M 230,280 L 260,270 L 270,310 L 240,320 Z',
    hotspotsCount: 7,
    cyberCrimes: 810,
    financialCrimes: 620,
    violentCrimes: 940,
    propertyCrimes: 1750
  },
  {
    id: 'mangaluu',
    name: 'Dakshina Kannada (Mangaluru)',
    threatIndex: 82,
    policeStationsCount: 45,
    totalCrimes2026: 6730,
    unresolvedCases: 1840,
    riskCategory: 'HIGH',
    lat: 180, lng: 270,
    path: 'M 160,250 L 190,240 L 200,290 L 170,300 Z',
    hotspotsCount: 11,
    cyberCrimes: 1940,
    financialCrimes: 1210,
    violentCrimes: 1530,
    propertyCrimes: 2050
  },
  {
    id: 'hubballi_dharwad',
    name: 'Dharwad (Hubballi)',
    threatIndex: 78,
    policeStationsCount: 38,
    totalCrimes2026: 5840,
    unresolvedCases: 1420,
    riskCategory: 'HIGH',
    lat: 160, lng: 160,
    path: 'M 140,140 L 180,130 L 190,170 L 150,180 Z',
    hotspotsCount: 9,
    cyberCrimes: 1020,
    financialCrimes: 940,
    violentCrimes: 1480,
    propertyCrimes: 2400
  },
  {
    id: 'belagavi',
    name: 'Belagavi District',
    threatIndex: 72,
    policeStationsCount: 42,
    totalCrimes2026: 4980,
    unresolvedCases: 1150,
    riskCategory: 'HIGH',
    lat: 130, lng: 110,
    path: 'M 110,90 L 150,80 L 160,130 L 120,140 Z',
    hotspotsCount: 8,
    cyberCrimes: 680,
    financialCrimes: 790,
    violentCrimes: 1320,
    propertyCrimes: 2190
  },
  {
    id: 'kalaburagi',
    name: 'Kalaburagi Division',
    threatIndex: 85,
    policeStationsCount: 52,
    totalCrimes2026: 7120,
    unresolvedCases: 2100,
    riskCategory: 'CRITICAL',
    lat: 220, lng: 60,
    path: 'M 200,40 L 240,30 L 250,80 L 210,90 Z',
    hotspotsCount: 12,
    cyberCrimes: 540,
    financialCrimes: 1120,
    violentCrimes: 2450,
    propertyCrimes: 3010
  },
  {
    id: 'shivamogga',
    name: 'Shivamogga',
    threatIndex: 52,
    policeStationsCount: 28,
    totalCrimes2026: 2980,
    unresolvedCases: 640,
    riskCategory: 'MEDIUM',
    lat: 190, lng: 200,
    path: 'M 170,180 L 210,170 L 220,220 L 180,230 Z',
    hotspotsCount: 4,
    cyberCrimes: 410,
    financialCrimes: 380,
    violentCrimes: 810,
    propertyCrimes: 1380
  },
  {
    id: 'tumakuru',
    name: 'Tumakuru Range',
    threatIndex: 59,
    policeStationsCount: 35,
    totalCrimes2026: 3540,
    unresolvedCases: 890,
    riskCategory: 'MEDIUM',
    lat: 240, lng: 210,
    path: 'M 220,190 L 250,180 L 260,230 L 230,240 Z',
    hotspotsCount: 5,
    cyberCrimes: 510,
    financialCrimes: 420,
    violentCrimes: 1010,
    propertyCrimes: 1600
  }
];

export const KSP_SUSPECTS: Suspect[] = [
  {
    id: 'suspect_01',
    name: 'Murali Mohan alias "Tech Murali"',
    aliases: 'Tech Murali, MM, Bengaluru Byte-Thief',
    age: 34,
    threatScore: 89,
    recidivismScore: 82,
    status: 'ACTIVE',
    primaryCrimeType: 'Cyber Fraud & Money Laundering',
    modusOperandi: 'Deploys advanced spear-phishing campaigns targeting financial officers in tech parks (Koramangala/Whitefield), redirects funds via shell accounts into crypto-wallets.',
    operatingHours: '09:00 PM - 03:00 AM (IST)',
    targetPreference: 'Corporate Executives & Premium Bank Accounts',
    geographicPreference: 'Bengaluru East and South regions, primarily Indiranagar, Bellandur, and Koramangala.',
    psychologicalIndicators: ['Anti-social Personality Disorder', 'Highly intelligent', 'Narcissistic traits', 'Calculated risk-taker'],
    networkInfluence: 'HIGH',
    activeCases: ['CASE_2026_001', 'CASE_2026_004'],
    phoneNumbers: ['+91 98860 12104', '+91 94480 34185'],
    vehicles: ['KA-03-MM-5561 (Black Audi A4)', 'KA-01-XX-9092 (White Royal Enfield)'],
    bankAccounts: ['HDFC-9081230198', 'ICICI-1102930219', 'PAYTM-8820120192'],
    narrativeSummary: 'Murali is a former software engineer who holds a post-graduate degree in Computer Science. Disillusioned with his corporate career, he built a local cyber fraud network in Karnataka. Under his orchestration, the syndicate has diverted over ₹45 Crore in the last 18 months. He leads an elite cell of hackers and uses Hawala routes to channel money.',
    associatedGangs: ['Bengaluru Digital Syndicate', 'Kolar Sand & Tech Cartel']
  },
  {
    id: 'suspect_02',
    name: 'Rudresh Gowda alias "JCB Rudra"',
    aliases: 'JCB Rudra, Kolar Rudra, Land Lord',
    age: 48,
    threatScore: 92,
    recidivismScore: 78,
    status: 'UNDER_SURVEILLANCE',
    primaryCrimeType: 'Land Grabbing & Sand Smuggling',
    modusOperandi: 'Uses armed intimidation and forged land survey deeds to seize government and private lands. Commands sand mining operations near Kolar riverbeds.',
    operatingHours: '04:00 AM - 10:00 AM & 08:00 PM - Midnight',
    targetPreference: 'Agricultural Landowners on Bengaluru Outskirts, Riverbed Sand reserves',
    geographicPreference: 'Kolar, Tumakuru, Doddaballapura, and Devanahalli border regions.',
    psychologicalIndicators: ['Extreme violent aggression', 'Paranoid traits', 'Dominating stature', 'High community dependency'],
    networkInfluence: 'HIGH',
    activeCases: ['CASE_2026_002'],
    phoneNumbers: ['+91 98450 78201', '+91 90080 11202'],
    vehicles: ['KA-04-RG-9999 (Gold Toyota Fortuner)', 'KA-07-M-2201 (JCB Loader)', 'KA-07-T-4552 (Tata Tipper Truck)'],
    bankAccounts: ['SBI-8012903102', 'CANARA-3029103901'],
    narrativeSummary: 'Rudresh Gowda has extensive connections in rural politics and local administration. He has used high-level protection to run illegal sand mining fleets in southern Karnataka. He operates out of Kolar but maintains three real estate shell offices in Outer Ring Road, Bengaluru. He commands a network of 40+ strongmen.',
    associatedGangs: ['Kolar Sand & Tech Cartel', 'Gowda Brothers Syndicate']
  },
  {
    id: 'suspect_03',
    name: 'Aditi Rao alias "Crypto Queen"',
    aliases: 'Aditi, Crypto Queen, Shadow Agent',
    age: 29,
    threatScore: 84,
    recidivismScore: 65,
    status: 'ABSCONDING',
    primaryCrimeType: 'Crypto Heist & Hawala Operations',
    modusOperandi: 'Sets up dummy investment platforms promising 300% APY in token markets, operates multi-level marketing scams, and processes international currency exchanges.',
    operatingHours: 'Flexible / 24 Hours online',
    targetPreference: 'Retail crypto-investors, high-net-worth tech developers',
    geographicPreference: 'Operates digitally out of Mangaluru, suspected hiding in Goa or Dubai.',
    psychologicalIndicators: ['Extremely manipulative', 'Cool demeanor under pressure', 'Sociopathic tendencies'],
    networkInfluence: 'MEDIUM',
    activeCases: ['CASE_2026_003', 'CASE_2026_004'],
    phoneNumbers: ['+91 99000 45451', '+91 88661 23091'],
    vehicles: ['KA-19-MC-0021 (Red Mercedes C-Class)'],
    bankAccounts: ['AXIS-9921029102', 'BINANCE-USER-90812'],
    narrativeSummary: 'Aditi is linked directly to global money laundering syndicates. She acts as the primary money washer for "Tech Murali" and other local crime lords. By converting standard fiat currency into Monero and Tether tokens, she has successfully bypassed state intelligence monitoring for over a year.',
    associatedGangs: ['Bengaluru Digital Syndicate', 'Coastal Shell Ring']
  },
  {
    id: 'suspect_04',
    name: 'Suresh "Blade" Kumar',
    aliases: 'Blade Suresh, SK, Razor Suresh',
    age: 41,
    threatScore: 75,
    recidivismScore: 90,
    status: 'INCARCERATED',
    primaryCrimeType: 'Extortion & Organized Theft',
    modusOperandi: 'Conducts armed daylight robbery and extorts protection fees from merchants in KR Market and Kalasipalyam.',
    operatingHours: '06:00 PM - Midnight',
    targetPreference: 'Wholesale vegetable merchants, jewelry shop owners',
    geographicPreference: 'KR Market, Kalasipalyam, Majestic, and Chikpet, Bengaluru.',
    psychologicalIndicators: ['Impulsive hostility', 'Substance abuse history', 'Low empathetic intelligence'],
    networkInfluence: 'LOW',
    activeCases: ['CASE_2026_005'],
    phoneNumbers: ['+91 91100 80112'],
    vehicles: ['KA-02-H-3321 (Modified Bajaj Pulsar Black)'],
    bankAccounts: ['KARNATAKA-1029013098'],
    narrativeSummary: 'A habitual offender with over 22 recorded cases. Currently lodged in Central Jail, Parappana Agrahara. Police intelligence suspects he still coordinates extortion operations from inside the prison walls via illegal smartphone conduits.',
    associatedGangs: ['KR Market Blade Gang']
  }
];

export const KSP_CASES: Case[] = [
  {
    id: 'CASE_2026_001',
    caseNumber: 'KSP/2026/CY-0891',
    title: 'Wipro Park Corporate Phishing Breach',
    type: 'Cyber Crime',
    district: 'Bengaluru City',
    station: 'Koramangala Cyber Crime PS',
    reportedDate: '2026-05-12',
    status: 'INVESTIGATING',
    suspectsLinked: ['suspect_01', 'suspect_03'],
    evidenceItems: [
      { id: 'ev_01', name: 'IP Log (Server 10.42.0.1)', type: 'Digital Log', confidence: 95, dateFound: '2026-05-13' },
      { id: 'ev_02', name: 'Spoofed Email Headers', type: 'Email Header', confidence: 88, dateFound: '2026-05-13' },
      { id: 'ev_03', name: 'Tether Wallet Address (TRC-20)', type: 'Crypto Address', confidence: 92, dateFound: '2026-05-15' }
    ],
    timeline: [
      { date: '2026-05-12 10:15 AM', title: 'Incident Reported', description: 'Wipro Finance Officer reports suspicious transfer of ₹4.8 Crore.', officer: 'Inspector K. Raghu' },
      { date: '2026-05-13 02:00 PM', title: 'Server Audit Done', description: 'Traced IP to VPN nodes routing through Seychelles and Bengaluru Jayanagar cell tower.', officer: 'Cyber Expert Asha Kiran' },
      { date: '2026-05-16 11:30 AM', title: 'Suspect Linked', description: 'Tether address matched with active ledger used by Aditi Rao in previous Mangaluru fraud case.', officer: 'DSP S. Kumar' }
    ],
    summary: 'Phishing email designed to look like the CEO request was sent to corporate finance, causing a transfer of ₹4.8 Crore. The funds were immediately converted to cryptocurrency and routed via international brokers.',
    threatLevel: 'CRITICAL'
  },
  {
    id: 'CASE_2026_002',
    caseNumber: 'KSP/2026/LS-4012',
    title: 'Chikkaballapura Highway Land Grab & Assault',
    type: 'Land Grabbing',
    district: 'Tumakuru Range',
    station: 'Chikkaballapura Rural PS',
    reportedDate: '2026-04-28',
    status: 'CHARGE_SHEETED',
    suspectsLinked: ['suspect_02'],
    evidenceItems: [
      { id: 'ev_04', name: 'Forged Survey Document (Deed #9011)', type: 'Document', confidence: 99, dateFound: '2026-04-30' },
      { id: 'ev_05', name: 'CCTV footage of heavy earth movers', type: 'Video Recording', confidence: 75, dateFound: '2026-04-29' },
      { id: 'ev_06', name: 'Illegal Country Pistol (7.65mm)', type: 'Weapon', confidence: 91, dateFound: '2026-05-02' }
    ],
    timeline: [
      { date: '2026-04-28 08:30 AM', title: 'FIR Filed', description: 'Farmer reports encroachers demolishing boundary wall with earthmovers.', officer: 'PSI Nagaraj' },
      { date: '2026-04-30 04:00 PM', title: 'Document Confiscation', description: 'Sub-registrar office audits confirm land registry deed #9011 is a high-grade counterfeit.', officer: 'RDO Shivaraj' },
      { date: '2026-05-03 01:00 AM', title: 'Weapons Seizure', description: 'Raid on Rudresh Gowda\'s farmhouse yields unregistered country pistols and cash.', officer: 'SP Vinay Gowda' }
    ],
    summary: 'Armed gang under Rudresh Gowda took physical control of a 12-acre parcel near National Highway 44. Local farmers were assaulted. A search operation uncovered forged land registry seals and illegal weapons.',
    threatLevel: 'HIGH'
  },
  {
    id: 'CASE_2026_003',
    caseNumber: 'KSP/2026/FI-2991',
    title: 'Mangaluru Crypto Exchange Multi-Level Ponzi',
    type: 'Financial Fraud',
    district: 'Dakshina Kannada (Mangaluru)',
    station: 'Mangaluru Cyber Crime Cell',
    reportedDate: '2026-02-15',
    status: 'COLD',
    suspectsLinked: ['suspect_03'],
    evidenceItems: [
      { id: 'ev_07', name: 'Platform Database Dump (K-Coin)', type: 'Database Backup', confidence: 98, dateFound: '2026-02-18' },
      { id: 'ev_08', name: 'Lease agreement of dummy office', type: 'Contract Document', confidence: 85, dateFound: '2026-02-20' }
    ],
    timeline: [
      { date: '2026-02-15 11:00 AM', title: 'Protests at Office', description: '120 investors file complaints as K-Coin platform halts withdrawals.', officer: 'PSI Laxman' },
      { date: '2026-02-20 03:00 PM', title: 'Office Raid', description: 'Mangaluru office found abandoned. Paper documents shredded, computers wiped.', officer: 'Inspector Rajesh' }
    ],
    summary: 'Aditi Rao set up K-Coin, an investment scheme targeting tech graduates in Dakshina Kannada. Collected ₹18 Crore before shutting down access and fleeing the state. Traces lead to crypto mixers.',
    threatLevel: 'HIGH'
  },
  {
    id: 'CASE_2026_004',
    caseNumber: 'KSP/2026/CY-1102',
    title: 'Bellandur Software firm Ransomware Breach',
    type: 'Cyber Crime',
    district: 'Bengaluru City',
    station: 'HAL Cyber Security Unit',
    reportedDate: '2026-06-02',
    status: 'INVESTIGATING',
    suspectsLinked: ['suspect_01', 'suspect_03'],
    evidenceItems: [
      { id: 'ev_09', name: 'Ransom note (Decrypt-us.txt)', type: 'Digital Document', confidence: 94, dateFound: '2026-06-03' },
      { id: 'ev_10', name: 'Malware binary payload hash', type: 'Executable Hash', confidence: 97, dateFound: '2026-06-03' }
    ],
    timeline: [
      { date: '2026-06-02 07:00 AM', title: 'Server Lockdown', description: 'All database nodes in Bellandur tech firm encrypted. Ransom of 15 BTC demanded.', officer: 'Asha Kiran' },
      { date: '2026-06-04 12:00 PM', title: 'Hawala Connection', description: 'Ransom payment wallet traced to cash conversion nodes linked directly to Aditi Rao\'s network.', officer: 'SP Cyber' }
    ],
    summary: 'A ransomware script encrypted central files of a flight-booking startup. Tech Murali is suspected of writing the payload. Cryptocurrency transactions show transfer links to Aditi Rao\'s accounts.',
    threatLevel: 'CRITICAL'
  }
];

export const KSP_TRANSACTIONS: Transaction[] = [
  { id: 'TXN_101', senderAccount: 'AXIS-9921029102', senderName: 'Aditi Rao (Shell Co: Ocean Tech)', receiverAccount: 'BINANCE-USER-90812', receiverName: 'Monero Conversion Wallet', amount: 48000000, date: '2026-05-15', riskScore: 92, flags: ['High Value', 'Suspect Shell Account', 'Crypto Conversion'], type: 'CROSS_BORDER' },
  { id: 'TXN_102', senderAccount: 'HDFC-9081230198', senderName: 'Murali Mohan', receiverAccount: 'AXIS-9921029102', receiverName: 'Aditi Rao', amount: 1500000, date: '2026-05-13', riskScore: 78, flags: ['Co-accused Transfer', 'Rapid Outflow'], type: 'LOCAL_SMURFI' },
  { id: 'TXN_103', senderAccount: 'CANARA-3029103901', senderName: 'Rudresh Gowda (Rudra Real Estates)', receiverAccount: 'SBI-9018230291', receiverName: 'Kolar Sand Lease Officer', amount: 3500000, date: '2026-04-29', riskScore: 84, flags: ['Potential Bribery', 'Real Estate Conduit'], type: 'HAWALA' },
  { id: 'TXN_104', senderAccount: 'SHELL-ACC-0912', senderName: 'Horizon Trading Ltd (Dubai)', receiverAccount: 'AXIS-9921029102', receiverName: 'Aditi Rao', amount: 12000000, date: '2026-06-01', riskScore: 88, flags: ['Tax Haven Origin', 'Shell Structured Flow'], type: 'SHELL_COMPANY' },
  { id: 'TXN_105', senderAccount: 'PAYTM-8820120192', senderName: 'Murali Mohan (Digital Wallet)', receiverAccount: 'PAYTM-7710293021', receiverName: 'Anonymous Sim Supplier', amount: 80000, date: '2026-05-10', riskScore: 65, flags: ['Mule Sim Purchase', 'Split Transfer'], type: 'LOCAL_SMURFI' }
];

// -------------------------------------------------------------
// NETWORK GRAPH INTEGRATED DATA MODEL
// -------------------------------------------------------------

export const NETWORK_NODES: NetworkNode[] = [
  // Suspects
  { id: 'node_murali', label: 'Murali Mohan', type: 'suspect', riskScore: 89, subtitle: '"Tech Murali"' },
  { id: 'node_rudra', label: 'Rudresh Gowda', type: 'suspect', riskScore: 92, subtitle: '"JCB Rudra"' },
  { id: 'node_aditi', label: 'Aditi Rao', type: 'suspect', riskScore: 84, subtitle: '"Crypto Queen"' },
  { id: 'node_blade', label: 'Blade Suresh', type: 'suspect', riskScore: 75, subtitle: 'Extortionist' },

  // Phone Numbers
  { id: 'node_phone_murali_1', label: '+91 98860 12104', type: 'phone', riskScore: 60, subtitle: 'Murali Primary' },
  { id: 'node_phone_murali_2', label: '+91 94480 34185', type: 'phone', riskScore: 45, subtitle: 'Murali Burner' },
  { id: 'node_phone_aditi_1', label: '+91 99000 45451', type: 'phone', riskScore: 70, subtitle: 'Aditi Secure' },
  { id: 'node_phone_rudra_1', label: '+91 98450 78201', type: 'phone', riskScore: 55, subtitle: 'Rudra Command' },

  // Vehicles
  { id: 'node_veh_audi', label: 'KA-03-MM-5561', type: 'vehicle', riskScore: 72, subtitle: 'Audi A4 (Black)' },
  { id: 'node_veh_fortuner', label: 'KA-04-RG-9999', type: 'vehicle', riskScore: 80, subtitle: 'Fortuner (Gold)' },
  { id: 'node_veh_tipper', label: 'KA-07-T-4552', type: 'vehicle', riskScore: 65, subtitle: 'Tipper Truck' },

  // Bank Accounts
  { id: 'node_bank_murali_hdfc', label: 'HDFC-9081230198', type: 'bank', riskScore: 75, subtitle: 'Murali Account' },
  { id: 'node_bank_aditi_axis', label: 'AXIS-9921029102', type: 'bank', riskScore: 88, subtitle: 'Ocean Tech Shell' },
  { id: 'node_bank_binance', label: 'Binance Wallet', type: 'bank', riskScore: 90, subtitle: 'Crypto Mixer Entry' },
  { id: 'node_bank_rudra_sbi', label: 'SBI-8012903102', type: 'bank', riskScore: 62, subtitle: 'Rudra Escrow' },

  // Locations
  { id: 'node_loc_koramangala', label: 'Koramangala Tech Park', type: 'location', riskScore: 40 },
  { id: 'node_loc_kolar', label: 'Kolar Riverbeds', type: 'location', riskScore: 75 },
  { id: 'node_loc_mangaluru', label: 'Hampankatta Office', type: 'location', riskScore: 50 },

  // Cases
  { id: 'node_case_phishing', label: 'CASE 001: Wipro Breach', type: 'case', riskScore: 95 },
  { id: 'node_case_landgrab', label: 'CASE 002: Kolar Assault', type: 'case', riskScore: 78 },
  { id: 'node_case_ponzi', label: 'CASE 003: Ponzi Scams', type: 'case', riskScore: 82 },
  { id: 'node_case_ransomware', label: 'CASE 004: Bellandur Breach', type: 'case', riskScore: 90 },

  // Weapons
  { id: 'node_wpn_pistol', label: '7.65mm Pistol', type: 'weapon', riskScore: 95, subtitle: 'Seized Serial 98A2' }
];

export const NETWORK_EDGES: NetworkEdge[] = [
  // Accused to Case
  { id: 'e1', source: 'node_murali', target: 'node_case_phishing', type: 'co_accused', weight: 9, label: 'Lead Suspect' },
  { id: 'e2', source: 'node_aditi', target: 'node_case_phishing', type: 'co_accused', weight: 8, label: 'Money Washer' },
  { id: 'e3', source: 'node_rudra', target: 'node_case_landgrab', type: 'co_accused', weight: 10, label: 'Mastermind' },
  { id: 'e4', source: 'node_aditi', target: 'node_case_ponzi', type: 'co_accused', weight: 9, label: 'Promoter' },
  { id: 'e5', source: 'node_murali', target: 'node_case_ransomware', type: 'co_accused', weight: 9, label: 'Developer' },
  { id: 'e6', source: 'node_aditi', target: 'node_case_ransomware', type: 'co_accused', weight: 7, label: 'Payout Agent' },

  // Accused to Phone
  { id: 'e7', source: 'node_murali', target: 'node_phone_murali_1', type: 'ownership', weight: 10, label: 'Registered SIM' },
  { id: 'e8', source: 'node_murali', target: 'node_phone_murali_2', type: 'ownership', weight: 8, label: 'Burner SIM' },
  { id: 'e9', source: 'node_aditi', target: 'node_phone_aditi_1', type: 'ownership', weight: 10 },
  { id: 'e10', source: 'node_rudra', target: 'node_phone_rudra_1', type: 'ownership', weight: 10 },

  // Phone to Phone communications (cross-syndicate connections)
  { id: 'e11', source: 'node_phone_murali_1', target: 'node_phone_aditi_1', type: 'communication', weight: 8, label: '42 Calls (May)' },
  { id: 'e12', source: 'node_phone_murali_2', target: 'node_phone_rudra_1', type: 'communication', weight: 5, label: '6 Calls (Apr)' },

  // Accused to Vehicle
  { id: 'e13', source: 'node_murali', target: 'node_veh_audi', type: 'ownership', weight: 9 },
  { id: 'e14', source: 'node_rudra', target: 'node_veh_fortuner', type: 'ownership', weight: 10 },
  { id: 'e15', source: 'node_rudra', target: 'node_veh_tipper', type: 'ownership', weight: 8 },

  // Accused to Bank Accounts
  { id: 'e16', source: 'node_murali', target: 'node_bank_murali_hdfc', type: 'ownership', weight: 10 },
  { id: 'e17', source: 'node_aditi', target: 'node_bank_aditi_axis', type: 'ownership', weight: 10 },
  { id: 'e18', source: 'node_rudra', target: 'node_bank_rudra_sbi', type: 'ownership', weight: 10 },

  // Transaction Trails
  { id: 'e19', source: 'node_bank_murali_hdfc', target: 'node_bank_aditi_axis', type: 'financial', weight: 8, label: '₹15L Transfer' },
  { id: 'e20', source: 'node_bank_aditi_axis', target: 'node_bank_binance', type: 'financial', weight: 9, label: '₹4.8Cr Crypto Buy' },

  // Location links
  { id: 'e21', source: 'node_murali', target: 'node_loc_koramangala', type: 'location_match', weight: 6, label: 'Frequently Tracked' },
  { id: 'e22', source: 'node_rudra', target: 'node_loc_kolar', type: 'location_match', weight: 9, label: 'Mining Site' },
  { id: 'e23', source: 'node_aditi', target: 'node_loc_mangaluru', type: 'location_match', weight: 7, label: 'Office' },

  // Weapon to case
  { id: 'e24', source: 'node_wpn_pistol', target: 'node_case_landgrab', type: 'co_accused', weight: 9, label: 'Ballistic Match' },
  { id: 'e25', source: 'node_rudra', target: 'node_wpn_pistol', type: 'ownership', weight: 8, label: 'Found at Raid' }
];
