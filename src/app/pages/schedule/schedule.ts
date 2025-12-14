import { Component, AfterViewInit, ViewChild, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { addIcons } from 'ionicons';
import {
  logoFacebook,
  logoInstagram,
  logoTwitter,
  logoVimeo,
  options,
  search,
  shareSocial,
} from 'ionicons/icons';

import { LowerCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  Config,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItemDivider,
  IonItemGroup,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { Matricula } from '../../interfaces/matricula';
import { ConferenceService } from '../../providers/conference.service';
import { MatriculaService } from '../../providers/matricula.service';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';

@Component({
    selector: 'page-schedule',
    templateUrl: 'schedule.html',
    styleUrls: ['./schedule.scss'],
    imports: [
        IonHeader,
        IonToolbar,
        IonButtons,
        IonContent,
        IonTitle,
        IonButton,
        IonList,
        IonListHeader,
        FormsModule,
        IonItemSliding,
        LowerCasePipe,
        RouterLink,
        IonItemGroup,
        IonItemDivider,
        IonItemOption,
        IonItemOptions,
        IonLabel,
        IonMenuButton,
    ],
    providers: [
        ModalController,
        AlertController,
        LoadingController,
        ToastController,
        Config,
    ]
})
export class SchedulePage {
  alertCtrl = inject(AlertController);
  loadingCtrl = inject(LoadingController);
  modalCtrl = inject(ModalController);
  router = inject(Router);
  routerOutlet = inject(IonRouterOutlet);
  toastCtrl = inject(ToastController);
  matriculaService = inject(MatriculaService);
  config = inject(Config);
  matriculaConfirmada = false;

  // Gets a reference to the list element
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;

  matriculas : Matricula[] = [];
  matriculasLidas = false;

  constructor() {
    addIcons({
      search,
      options,
      shareSocial,
      logoVimeo,
      logoInstagram,
      logoTwitter,
      logoFacebook,
    });
  }

  ionViewWillEnter() {
    if(this.matriculasLidas) {
      this.matriculas = this.matriculaService.search();
    }
    else {  
      this.matriculaService.getMatriculas().subscribe(data => {
        this.matriculas = data.matriculas;
      });
      this.matriculasLidas = true;
    }  
  }
    
  confirmarMatricula() {
    this.matriculaConfirmada = true;
    this.matriculaService.confirmarMatricula();
  }

  verificarMatricula() {
    this.matriculaConfirmada = this.matriculaService.verificarMatriculaConfirmada();
    for(let matricula of this.matriculas) {
      if(matricula.status == 'PreMatricula') {
        return true;
      }
    }
    return false;
  }

}
