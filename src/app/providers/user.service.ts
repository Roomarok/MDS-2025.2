import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { UserOptions, UserData } from '../interfaces/user-options';

import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
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

  login(login: UserOptions) : Promise<boolean> {
    console.log('login');
    var hasLoggedIn = false;

    for(var i = 0; i < this.data.users.length; i++) {
      if(this.data.users[i].username == login.username && this.data.users[i].password == login.password) {
        hasLoggedIn = true;
        break;
      }
    }
    console.log(hasLoggedIn);
    if(hasLoggedIn) {
      return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
        this.setUsername(login.username);
        return window.dispatchEvent(new CustomEvent('user:login'));
      });
    }
    else {
      return this.storage.set(this.HAS_LOGGED_IN, false).then(() => {
        return window.dispatchEvent(new CustomEvent('user:loginError'));
      });
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

}
