export const VALIDATION_CONFIG = {
  MIN_KEY_LENGTH: 5,
  ALLOWED_ROLES: ['admin', 'marketing'],
};

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
  CLIENT_DELETE_ERROR: "Nepavyko ištrinti kliento iš sistemos.",

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