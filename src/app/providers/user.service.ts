import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { UserOptions, UserData } from '../interfaces/user-options';

import { HttpClient } from '@angular/common/http';
import { of, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  storage = inject(Storage);
  http = inject(HttpClient);

  favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  data: UserData | null = null;

  FAILED_ATTEMPTS = 'loginFailedAttempts';
  LOCKOUT_UNTIL = 'loginLockoutUntil';

  constructor(
  ) {
    this.getUsers().subscribe(()=>{
      console.log(this.data);
    })  
  }

  load() {
    console.log('load');
    if (this.data) {
      return of(this.data);
    } else {
      return this.http
        .get<UserData>('assets/data/user.json')
        .pipe(map(this.processData, this));
    }
  }

  processData(data: UserData): UserData {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    console.log('processData');
    this.data = data;
    return this.data;
  }


  hasFavorite(sessionName: string): boolean {
    return this.favorites.indexOf(sessionName) > -1;
  }

  addFavorite(sessionName: string): void {
    this.favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this.favorites.indexOf(sessionName);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
  }



  signup(username: string): Promise<boolean> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(username);
      return window.dispatchEvent(new CustomEvent('user:signup'));
    });
  }

  logout(): Promise<any> {
    return this.storage
      .remove(this.HAS_LOGGED_IN)
      .then(() => {
        return this.storage.remove('username');
      })
      .then(() => {
        window.dispatchEvent(new CustomEvent('user:logout'));
      });
  }

  setUsername(username: string): Promise<any> {
    return this.storage.set('username', username);
  }

  getUsername(): Promise<string> {
    return this.storage.get('username').then(value => {
      return value;
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then(value => {
      return value === true;
    });
  }
  getUsers() {
    console.log('getUsers');
    return this.load().pipe(map((data: UserData) => data));
  }

  async getFailedAttempts(): Promise<number> {
    const v = await this.storage.get(this.FAILED_ATTEMPTS);
    return typeof v === 'number' ? v : 0;
  }

  async resetFailedAttempts(): Promise<void> {
    await this.storage.set(this.FAILED_ATTEMPTS, 0);
  }

  async incrementFailedAttempts(): Promise<number> {
    const current = await this.getFailedAttempts();
    const next = current + 1;
    await this.storage.set(this.FAILED_ATTEMPTS, next);
    return next;
  }

  async setLockout(minutes: number): Promise<void> {
    const until = Date.now() + minutes * 60 * 1000;
    await this.storage.set(this.LOCKOUT_UNTIL, until);
  }

  async clearLockout(): Promise<void> {
    await this.storage.remove(this.LOCKOUT_UNTIL);
  }

  async getLockRemaining(): Promise<number> {
    const until = await this.storage.get(this.LOCKOUT_UNTIL);
    if (!until) return 0;
    const remaining = Number(until) - Date.now();
    if (remaining <= 0) {
      await this.clearLockout();
      return 0;
    }
    return remaining;
  }

  async login(login: UserOptions): Promise<{ success: boolean; locked: boolean; remaining?: number }> {
    console.log('login');

    if (!this.data) {
      try {
        await lastValueFrom(this.load());
      } catch (e) {
        console.error('Erro ao carregar dados de usuário', e);
      }
    }

    const lockRemaining = await this.getLockRemaining();
    if (lockRemaining > 0) {
      return { success: false, locked: true, remaining: lockRemaining };
    }

    let hasLoggedIn = false;

    if (this.data && this.data.users) {
      for (let i = 0; i < this.data.users.length; i++) {
        if (this.data.users[i].username == login.username && this.data.users[i].password == login.password) {
          hasLoggedIn = true;
          break;
        }
      }
    }

    console.log('login result:', hasLoggedIn);

    if (hasLoggedIn) {
      // se logar reseta o bloqueio
      await this.resetFailedAttempts();
      await this.clearLockout();
      await this.storage.set(this.HAS_LOGGED_IN, true);
      await this.setUsername(login.username);
      window.dispatchEvent(new CustomEvent('user:login'));
      return { success: true, locked: false };
    } else {
      const attempts = await this.incrementFailedAttempts();
      // depois de 5 tentativas bloqueia o login por 10 min
      if (attempts >= 5) {
        await this.setLockout(10);
        // reseta o bloqueio depois dos 10 min
        await this.resetFailedAttempts();
        window.dispatchEvent(new CustomEvent('user:loginError'));
        return { success: false, locked: true, remaining: 10 * 60 * 1000 };
      }
      window.dispatchEvent(new CustomEvent('user:loginError'));
      return { success: false, locked: false };
    }
  }

}
