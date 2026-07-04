import { 
  MdArchive, MdCancel, MdPending, MdTrendingUp, 
  MdCheckCircle, MdVerifiedUser, MdStar, MdPhoneInTalk 
} from 'react-icons/md';

export const VALIDATION_CONFIG = {
  MIN_KEY_LENGTH: 5,
  ALLOWED_ROLES: ['admin', 'marketing'],
};

// Perkelta žymių prioriteto konfigūracija rūšiavimui
export const TAG_PRIORITY = { 
  'active client': 100, 'approved': 90, 'potential 10': 85, 'potential 9': 84, 
  'potential 8': 83, 'potential 7': 82, 'potential 6': 81, 'potential 5': 80, 
  'potential 4': 79, 'potential 3': 78, 'potential 2': 77, 'potential 1': 76, 
  'pending': 50, 'unprocessed': 20, 'archived client': 10, 'disapproved': 0 
};

export const CLIENT_TAGS_CONFIG = {
  'unprocessed': { translation: 'neapdorota', colorClass: 'text-emerald-600 dark:text-emerald-400 font-medium', styles: 'bg-emerald-50 text-emerald-600 border-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-400', icon: MdPhoneInTalk },
  'disapproved': { translation: 'atmesta', colorClass: 'text-red-600 dark:text-red-400 font-medium', styles: 'bg-red-50 text-red-600 border-red-600 dark:bg-red-950/30 dark:text-red-400 dark:border-red-400', icon: MdCancel },
  'pending': { translation: 'laukia', colorClass: 'text-yellow-600 dark:text-yellow-400 font-medium', styles: 'bg-yellow-50 text-yellow-600 border-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-400', icon: MdPending },
  'approved': { translation: 'patvirtinta', colorClass: 'text-green-600 dark:text-green-400 font-medium', styles: 'bg-green-50 text-green-600 border-green-600 dark:bg-green-950/30 dark:text-green-400 dark:border-green-400', icon: MdCheckCircle },
  'active client': { translation: 'aktyvus klientas', colorClass: 'text-blue-600 dark:text-blue-400 font-medium', styles: 'bg-blue-50 text-blue-600 border-blue-600 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-400', icon: MdStar },
  'archived client': { translation: 'archyvuotas klientas', colorClass: 'text-amber-800 dark:text-amber-500 font-medium', styles: 'bg-amber-100 text-amber-800 border-amber-800 dark:bg-amber-950/40 dark:text-amber-500 dark:border-amber-600', icon: MdArchive },
  'potential 1': { translation: 'potencialas 1', colorClass: 'text-red-600 dark:text-red-400 font-medium', styles: 'bg-red-50 text-red-600 border-red-600 dark:bg-red-950/30 dark:text-red-400 dark:border-red-400', icon: MdCancel },
  'potential 2': { translation: 'potencialas 2', colorClass: 'text-red-600 dark:text-red-400 font-medium', styles: 'bg-red-50 text-red-600 border-red-600 dark:bg-red-950/30 dark:text-red-400 dark:border-red-400', icon: MdCancel },
  'potential 3': { translation: 'potencialas 3', colorClass: 'text-red-600 dark:text-red-400 font-medium', styles: 'bg-red-50 text-red-600 border-red-600 dark:bg-red-950/30 dark:text-red-400 dark:border-red-400', icon: MdCancel },
  'potential 4': { translation: 'potencialas 4', colorClass: 'text-red-600 dark:text-red-400 font-medium', styles: 'bg-red-50 text-red-600 border-red-600 dark:bg-red-950/30 dark:text-red-400 dark:border-red-400', icon: MdCancel },
  'potential 5': { translation: 'potencialas 5', colorClass: 'text-yellow-600 dark:text-yellow-400 font-medium', styles: 'bg-yellow-50 text-yellow-600 border-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-400', icon: MdTrendingUp },
  'potential 6': { translation: 'potencialas 6', colorClass: 'text-yellow-600 dark:text-yellow-400 font-medium', styles: 'bg-yellow-50 text-yellow-600 border-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-400', icon: MdTrendingUp },
  'potential 7': { translation: 'potencialas 7', colorClass: 'text-yellow-600 dark:text-yellow-400 font-medium', styles: 'bg-yellow-50 text-yellow-600 border-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-400', icon: MdTrendingUp },
  'potential 8': { translation: 'potencialas 8', colorClass: 'text-green-600 dark:text-green-400 font-medium', styles: 'bg-green-50 text-green-600 border-green-600 dark:bg-green-950/30 dark:text-green-400 dark:border-green-400', icon: MdTrendingUp },
  'potential 9': { translation: 'potencialas 9', colorClass: 'text-green-600 dark:text-green-400 font-medium', styles: 'bg-green-50 text-green-600 border-green-600 dark:bg-green-950/30 dark:text-green-400 dark:border-green-400', icon: MdTrendingUp },
  'potential 10': { translation: 'potencialas 10', colorClass: 'text-green-600 dark:text-green-400 font-medium', styles: 'bg-green-50 text-green-600 border-green-600 dark:bg-green-950/30 dark:text-green-400 dark:border-green-400', icon: MdTrendingUp }
};

export const INITIAL_TAGS = [
  ...Array.from({ length: 10 }, (_, i) => `potential ${i + 1}`),
  'pending',
  'disapproved',
  'unprocessed'
];

export const ERRORS = {
  GLOBAL_NOT_FOUND: "Klaida: Objektas nerastas sistemoje.",
  GLOBAL_VALIDATION_ERROR: "Klaida: Duomenų struktūros validacijos klaida.",
  GLOBAL_UNKNOWN_ERROR: "Įvyko nenumatyta sisteminė klaida.",
  CLIENT_NAME_REQUIRED: "Klaida: Įmonės pavadinimas yra privalomas.",
  CLIENT_TAG_REQUIRED: "Klaida: Nepasirinktas kliento statusas.",
  CLIENT_CONTACTS_REQUIRED_FOR_UNPROCESSED: "Klaida: Neapdorotiems klientams būtina pridėti bent vieną validų kontaktą.",
  CLIENT_DUPLICATE_NAME: "Klaida: Klientas su tokiu pavadinimu jau egzistuoja sistemoje.",
  CLIENT_FETCH_ERROR: "Nepavyko užkrauti klientų sąrašo.",
  CLIENT_CREATE_ERROR: "Nepavyko sukurti kliento paskyros.",
  CLIENT_UPDATE_ERROR: "Nepavyko atnaujinti kliento duomenų.",
  CLIENT_UPDATE_SUCCESS: "Kliento duomenys sėkmingai atnaujinti!",
  CLIENT_DELETE_ERROR: "Nepavyko ištrinti kliento iš sistemos.",
  CLIENT_DELETE_SUCCESS: "Kliento paskyra sėkmingai pašalinta iš sistemos.",
  KEY_OWNER_REQUIRED: "Savininkas yra privalomas.",
  KEY_TOO_SHORT: "API raktas privalo būti ne trumpesnis nei 5 simboliai.",
  KEY_INVALID_ROLE: "Neteisingas rolės pasirinkimas.",
  KEY_DUPLICATE: "Šis raktas jau užregistruotas sistemoje.",
  KEY_DUPLICATE_OWNER: "Šis savininkas jau turi priskirtą raktą.",
  KEY_FETCH_ERROR: "Nepavyko užkrauti raktų.",
  KEY_DELETE_ADMIN_FORBIDDEN: "Adminų trinti negalima.",
  KEY_DELETE_ERROR: "Klaida trinant raktą.",
  AUTH_KEY_REQUIRED: "Raktas nepateiktas.",
  AUTH_INVALID_CREDENTIALS: "Neteisingas raktas.",
  AUTH_SERVER_ERROR: "Serverio klaida login metu.",
  FORM_ALL_FIELDS_REQUIRED: "Prašome užpildyti visus laukus.",
  FORM_OWNER_REQUIRED: "Prašome įvesti prieigos rakto savininką.",
  FORM_KEY_REQUIRED: "Prašome įvesti prieigos raktą.",
  FORM_COPY_SUCCESS: "Prieigos raktas nukopijuotas sėkmingai.",
  FORM_COPY_ERROR: "Nepavyko nukopijuoti rakto.",
  FORM_CREATE_SUCCESS: "Naujas prieigos raktas sukurtas sėkmingai.",
  FORM_CREATE_ERROR: "Nepavyko pridėti prieigos rakto dėl serverio klaidos."
};