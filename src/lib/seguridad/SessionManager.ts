// lib/seguridad/SessionManager.ts

type SessionData = Record<string, any>;
const sessionStore = new Map<string, SessionData>();

import { v4 as uuidv4 } from "uuid";

export class SessionManager {
  static createSession(data: SessionData): string {
    const sessionId = uuidv4();
    sessionStore.set(sessionId, data);
    return sessionId;
  }

  static getSession(sessionId: string): SessionData | null {
    return sessionStore.get(sessionId) || null;
  }

  static deleteSession(sessionId: string): void {
    sessionStore.delete(sessionId);
  }

  static hasSession(sessionId: string): boolean {
    return sessionStore.has(sessionId);
  }
}
