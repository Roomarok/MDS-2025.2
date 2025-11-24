import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonInput,
  IonMenuButton,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { UserOptions } from '../../interfaces/user-options';
import { UserService } from '../../providers/user.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonHeader,
    IonInput,
    IonMenuButton,
    IonRow,
    IonTitle,
    IonToolbar,
  ],
})
export class LoginPage {
  private router = inject(Router);
  private user = inject(UserService);

  login: UserOptions = { username: '', password: '' };
  submitted = false;
  locked = false;
  lockRemaining = 0; // ms
  private lockTimer: any = null;

  ngOnInit(): void {
    this.checkLock();
  }

  ngOnDestroy(): void {
    if (this.lockTimer) {
      clearInterval(this.lockTimer);
      this.lockTimer = null;
    }
  }

  onLogin(form: NgForm) {
    console.log(this.login.username);
    this.submitted = true;

    if (this.locked) {
      return;
    }

    if (form.valid) {
      this.user.login(this.login).then((result: any) => {
        if (result && result.locked) {
          this.locked = true;
          this.lockRemaining = result.remaining ?? 10 * 60 * 1000;
          this.startLockTimer();
        } else if (result && result.success) {
          // login successful; navigation or other handling can be added here
          console.log('Login successful');
        } else {
          // failed but not yet locked
          console.log('Login failed');
        }
      });
    }
  }

  private async checkLock() {
    const remaining = await this.user.getLockRemaining();
    if (remaining > 0) {
      this.locked = true;
      this.lockRemaining = remaining;
      this.startLockTimer();
    } else {
      this.locked = false;
    }
  }

  private startLockTimer() {
    if (this.lockTimer) {
      clearInterval(this.lockTimer);
    }
    this.lockTimer = setInterval(async () => {
      this.lockRemaining -= 1000;
      if (this.lockRemaining <= 0) {
        clearInterval(this.lockTimer);
        this.lockTimer = null;
        this.locked = false;
        this.lockRemaining = 0;
        // ensure storage is cleared
        await this.user.getLockRemaining();
      }
    }, 1000);
  }

  get lockMinutes(): number {
    return Math.floor(this.lockRemaining / 60000);
  }

  get lockSeconds(): string {
    const s = Math.floor((this.lockRemaining % 60000) / 1000);
    return s.toString().padStart(2, '0');
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }
}
