import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cloudDownload,
  share,
  shareOutline,
  star,
  starOutline,
} from 'ionicons/icons';

import { Session } from '../../interfaces/conference.interfaces';
import { ConferenceService } from '../../providers/conference.service';
import { UserService } from '../../providers/user.service';
import { Matricula } from '../../interfaces/matricula';
import { MatriculaService } from '../../providers/matricula.service';

@Component({
    selector: 'page-session-detail',
    styleUrls: ['./session-detail.scss'],
    templateUrl: 'session-detail.html',
    imports: [
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonContent,
        IonButton,
        IonIcon,
        IonList,
        IonItem,
        IonLabel,
        IonText,
    ]
})
export class SessionDetailPage {
  private matriculaService = inject(MatriculaService);
//  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  matricula: Matricula;
  isFavorite = false;
  defaultHref = '';

  constructor() {
    addIcons({ shareOutline, starOutline, star, cloudDownload, share });
  }

  ionViewWillEnter() {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    this.matricula = this.matriculaService.detail(sessionId);
    console.log(this.matricula);
/*
    this.matriculaService.getMatriculas().subscribe(data => {
      if (
        data 
      ) {
        const sessionId = this.route.snapshot.paramMap.get('sessionId');
        console.log('id='+sessionId);
        for (const matricula of data.matriculas) {
          if (matricula.id == sessionId) {
            this.matricula = matricula;
            break;
          }
        }
        console.log(this.matricula);
      }
    });
*/    
  }

  ionViewDidEnter() {
    this.defaultHref = '/app/tabs/schedule';
  }
/*
  sessionClick(item: string) {
    console.log('Clicked', item);
  }

  toggleFavorite() {
    const sessionName = this.session.name;
    if (this.userService.hasFavorite(sessionName)) {
      this.userService.removeFavorite(sessionName);
      this.isFavorite = false;
    } else {
      this.userService.addFavorite(this.session.name);
      this.isFavorite = true;
    }
  }

  shareSession() {
    console.log('Clicked share session');
  }
*/    
  verificarMatriculaConfirmada() {
    return this.matriculaService.matriculaConfirmada;
  }

  alterarStatus(status) {
    this.matriculaService.patchStatus(this.matricula.id,status);
    this.router.navigateByUrl(this.defaultHref);

  }

  excluir() {
    this.matriculaService.delete(this.matricula.id);
    this.router.navigateByUrl(this.defaultHref);
  }
}
