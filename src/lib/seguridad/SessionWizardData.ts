// SessionWizardData.ts
export type WizardSessionData = {
  cedula: string;
  secuencial: number;
  nombres: string;
  apellidos: string;
  displayName?: string;
  photoURL?: string;
};
  
  export class SessionWizardData {
    private static readonly WIZARD_KEY = 'wizardData';
  
    static guardar(data: WizardSessionData) {
      localStorage.setItem(this.WIZARD_KEY, JSON.stringify(data));
    }
  
    static obtener(): WizardSessionData | null {
      const raw = localStorage.getItem(this.WIZARD_KEY);
      try {
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }
  
    static limpiar(): void {
      localStorage.removeItem(this.WIZARD_KEY);
    }
  }
  