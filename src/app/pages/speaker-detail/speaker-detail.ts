import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import {
  ActionSheetController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  callOutline,
  callSharp,
  logoGithub,
  logoInstagram,
  logoTwitter,
  shareOutline,
  shareSharp,
} from 'ionicons/icons';
import { Speaker } from '../../interfaces/conference.interfaces';
import { ConferenceService } from '../../providers/conference.service';
import { Turma } from '../../interfaces/turma';
import { TurmaService } from '../../providers/turma.service';

@Component({
    selector: 'page-speaker-detail',
    templateUrl: 'speaker-detail.html',
    styleUrls: ['./speaker-detail.scss'],
    imports: [
        IonContent,
        IonList,
        IonItem,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonButton,
        IonIcon,
        IonChip,
        IonLabel,
        NgOptimizedImage,
    ],
    providers: [InAppBrowser, ActionSheetController]
})
export class SpeakerDetailPage {
  turmas: Turma[] = [];
  defaultHref = '';

  private turmaService = inject(TurmaService);
  private route = inject(ActivatedRoute);
  private actionSheetCtrl = inject(ActionSheetController);
  private inAppBrowser = inject(InAppBrowser);

  constructor() {
    addIcons({
      callOutline,
      callSharp,
      shareOutline,
      shareSharp,
      logoTwitter,
      logoGithub,
      logoInstagram,
    });
  }

  ionViewWillEnter() {
    this.defaultHref = '/app/tabs/speakers';
    this.turmaService.load().subscribe(data => {
      const disciplinaId = this.route.snapshot.paramMap.get('speakerId');
      console.log(disciplinaId);
      if (data && data.turmas) {
        this.turmas = [];
        for (const turma of data.turmas) {
          if (turma.disciplina.codigo == disciplinaId) {
            this.turmas.push(turma);
          }
        }
      }
    });
  }

  openExternalUrl(url: string) {
    this.inAppBrowser.create(url, '_blank');
  }

  async openSpeakerShare(speaker: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            console.log(
              'Copy link clicked on https://twitter.com/' + speaker.twitter
            );
            if (
              (window as any).cordova &&
              (window as any).cordova.plugins.clipboard
            ) {
              (window as any).cordova.plugins.clipboard.copy(
                'https://twitter.com/' + speaker.twitter
              );
            }
          },
        },
        {
          text: 'Share via ...',
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  async openContact(speaker: Speaker) {
    const mode = 'ios'; // this.config.get('mode');

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Contact ' + speaker.name,
      buttons: [
        {
          text: `Email ( ${speaker.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + speaker.email);
          },
        },
        {
          text: `Call ( ${speaker.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + speaker.phone);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }
}
