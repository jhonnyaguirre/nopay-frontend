// ==============================
// Clave única de sesión temporal
// ==============================

export const createSessionNonce = (): string => {
  const nonce = crypto.randomUUID();
  localStorage.setItem("sessionNonce", nonce);
  return nonce;
};

export const getSessionNonce = (): string | null => {
  return localStorage.getItem("sessionNonce");
};

// ==============================
// Token de autenticación general
// ==============================

//export const setGlobalToken = (token: string) => {
  //localStorage.setItem('authToken', token);
//};

//export const getGlobalToken = (): string => {
//  return localStorage.getItem('authToken') || '';
//};

// ==============================
// Token exclusivo del wizard (flujo independiente)
// ==============================

export const setWizardToken = (token: string) => {
  localStorage.setItem('authTokenWizard', token);
};

export const getWizardToken = (): string => {
  return localStorage.getItem('authTokenWizard') || '';
};
