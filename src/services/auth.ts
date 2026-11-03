import { UserProfile } from '../types';

// Storage keys
const AUTH_USER_STORAGE_KEY = 'imch_auth_current_user';
const USERS_DB_STORAGE_KEY = 'imch_registered_users_db';

// Legacy mock emails to purge completely
const LEGACY_MOCK_EMAILS = [
  'antonio@dev.imch.ao',
  'sofialane5720@gmail.com',
  'carlos@imch.pt',
  'dev@imch.ao',
  'mariana.silva@dev.ao',
];

class AuthService {
  private currentUser: UserProfile | null = null;
  private listeners: Array<(user: UserProfile | null) => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      // Purge any legacy mock demo accounts from local storage
      const existingDbRaw = localStorage.getItem(USERS_DB_STORAGE_KEY);
      let db = existingDbRaw ? JSON.parse(existingDbRaw) : [];

      // Filter out any mock/demo accounts
      db = db.filter((u: any) => !LEGACY_MOCK_EMAILS.includes((u.email || '').toLowerCase().trim()));
      localStorage.setItem(USERS_DB_STORAGE_KEY, JSON.stringify(db));

      // Restore session ONLY if user is a real user
      const savedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.email && !LEGACY_MOCK_EMAILS.includes(parsed.email.toLowerCase().trim())) {
          this.currentUser = parsed;
        } else {
          localStorage.removeItem(AUTH_USER_STORAGE_KEY);
          this.currentUser = null;
        }
      } else {
        this.currentUser = null;
      }
    } catch {
      this.currentUser = null;
    }
  }

  private saveCurrentSession(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
    this.notify();
  }

  public subscribe(callback: (user: UserProfile | null) => void) {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentUser));
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public login(email: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
    try {
      const db = JSON.parse(localStorage.getItem(USERS_DB_STORAGE_KEY) || '[]');
      const found = db.find(
        (u: any) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
      );

      if (!found) {
        return { success: false, error: 'Email não registado. Crie uma nova conta clicando em Criar Conta.' };
      }

      if (found.passwordHash !== password) {
        return { success: false, error: 'Palavra-passe incorreta.' };
      }

      const userProfile: UserProfile = {
        id: found.id,
        name: found.name,
        email: found.email,
        plan: found.plan || 'free',
        credits: typeof found.credits === 'number' ? found.credits : 3,
        avatarUrl: found.avatarUrl,
        createdAt: found.createdAt || new Date().toISOString(),
      };

      this.currentUser = userProfile;
      this.saveCurrentSession(userProfile);
      return { success: true, user: userProfile };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao iniciar sessão.' };
    }
  }

  public getRegisteredAccounts(): Array<{ name: string; email: string; plan: 'free' | 'pro' }> {
    try {
      const db = JSON.parse(localStorage.getItem(USERS_DB_STORAGE_KEY) || '[]');
      return db.map((u: any) => ({ name: u.name, email: u.email, plan: u.plan || 'free' }));
    } catch {
      return [];
    }
  }

  public register(name: string, email: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
    try {
      const db = JSON.parse(localStorage.getItem(USERS_DB_STORAGE_KEY) || '[]');
      const exists = db.some(
        (u: any) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
      );

      if (exists) {
        return { success: false, error: 'Já existe uma conta com este e-mail. Faz login.' };
      }

      const newUser: UserProfile = {
        id: 'usr-' + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        plan: 'free',
        credits: 3, // 3 free welcome credits!
        createdAt: new Date().toISOString(),
      };

      db.push({
        ...newUser,
        passwordHash: password,
      });

      localStorage.setItem(USERS_DB_STORAGE_KEY, JSON.stringify(db));

      this.currentUser = newUser;
      this.saveCurrentSession(newUser);
      return { success: true, user: newUser };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao criar conta.' };
    }
  }

  public logout(): void {
    this.currentUser = null;
    this.saveCurrentSession(null);
  }

  public upgradeToPro(paymentMethod = 'Multicaixa Express', reference = ''): UserProfile {
    if (!this.currentUser) {
      throw new Error('Utilizador não autenticado.');
    }

    const updated: UserProfile = {
      ...this.currentUser,
      plan: 'pro',
      credits: 99999, // unlimited
    };

    this.currentUser = updated;
    this.saveCurrentSession(updated);
    this.syncUserToDb(updated);

    return updated;
  }

  public addCredits(amount: number): UserProfile {
    if (!this.currentUser) {
      throw new Error('Utilizador não autenticado.');
    }

    const updated: UserProfile = {
      ...this.currentUser,
      credits: (this.currentUser.credits || 0) + amount,
    };

    this.currentUser = updated;
    this.saveCurrentSession(updated);
    this.syncUserToDb(updated);

    return updated;
  }

  public consumeCredit(): { allowed: boolean; remaining: number; reason?: string } {
    if (!this.currentUser) {
      return {
        allowed: false,
        remaining: 0,
        reason: 'Precisa de iniciar sessão ou criar conta para gerar aplicações.',
      };
    }

    if (this.currentUser.plan === 'pro') {
      return { allowed: true, remaining: 99999 };
    }

    if (this.currentUser.credits <= 0) {
      return {
        allowed: false,
        remaining: 0,
        reason: 'Os seus créditos gratuitos esgotaram. Faça upgrade para o Plano PRO para continuar a criar!',
      };
    }

    const updated: UserProfile = {
      ...this.currentUser,
      credits: this.currentUser.credits - 1,
    };

    this.currentUser = updated;
    this.saveCurrentSession(updated);
    this.syncUserToDb(updated);

    return { allowed: true, remaining: updated.credits };
  }

  private syncUserToDb(user: UserProfile) {
    try {
      const db = JSON.parse(localStorage.getItem(USERS_DB_STORAGE_KEY) || '[]');
      const index = db.findIndex((u: any) => u.id === user.id);
      if (index !== -1) {
        db[index] = {
          ...db[index],
          plan: user.plan,
          credits: user.credits,
          name: user.name,
        };
        localStorage.setItem(USERS_DB_STORAGE_KEY, JSON.stringify(db));
      }
    } catch {}
  }
}

export const authService = new AuthService();
