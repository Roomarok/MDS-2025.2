import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import {
  ActionSheetController,
  AlertController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  ToastController,
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
import { Turma } from '../../interfaces/turma';
import { TurmaService } from '../../providers/turma.service';
import { MatriculaService } from '../../providers/matricula.service';

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
        IonTitle,
        IonLabel,
    ],
    providers: [InAppBrowser, ActionSheetController]
})
export class SpeakerDetailPage {
  turmas: Turma[] = [];
  defaultHref = '';
  disciplina = '';

  private turmaService = inject(TurmaService);
  private matriculaService = inject(MatriculaService);
  private route = inject(ActivatedRoute);
  private actionSheetCtrl = inject(ActionSheetController);
  private inAppBrowser = inject(InAppBrowser);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);


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
      this.disciplina = this.route.snapshot.paramMap.get('speakerId');
      if (data && data.turmas) {
        this.turmas = [];
        for (const turma of data.turmas) {
          if (turma.disciplina.codigo == this.disciplina) {
            this.turmas.push(turma);
          }
        }
      }
    });
  }

  async confirmarInclusaoTurma(turma: Turma) {
    const alert = await this.alertCtrl.create({
      header: 'Prioridade',
      buttons: [
        'Cancelar',
        {
          text: 'Confirmar',
          handler: (data: any) => {
            console.log(data);
            this.incluirTurma(turma,data.prioridade);
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'prioridade',
          placeholder: 'prioridade'
        }
      ]
    });
    await alert.present();

  }

  async incluirTurma(turma: Turma,prioridade: number) {
    console.log(turma);
    console.log(prioridade);
    if(!this.verificarTurmasDuplicadas(turma)) {
      this.matriculaService.add({
        _type: 'Matricula',
        prioridade: prioridade,
        status: 'Pedido',
        turma: turma
      });
    } else {
      /* mensagem de turma duplicada */
      const toast = await this.toastCtrl.create({
        message: 'A turma não pode ser adiciona, pois já existe uma matrícula para o aluno nesta turma.',
        position: 'top',
        duration: 3000
/*        buttons: [
          {
            role: 'cancel',
            text: 'Ok'
          }
        ]*/
      });

      await toast.present();
    }
  };

  verificarTurmasDuplicadas(turma: Turma) {
    let matriculas = this.matriculaService.search();
    let duplicada = false;
    for(let matricula of matriculas) {
      if(matricula.turma.disciplina.codigo == turma.disciplina.codigo &&
         matricula.turma.codigo == turma.codigo)
         duplicada = true;
    }
    return duplicada;
  }

  verificarMatriculaConfirmada() {
    return this.matriculaService.verificarMatriculaConfirmada();
  }


}
