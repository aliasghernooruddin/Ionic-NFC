import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { ApisService } from '../../services/apis.service';
import { Toast } from '@ionic-native/toast/ngx';
import { NFC } from '@ionic-native/nfc';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  eventDetails = null;
  userDetails = null;
  show = false;
  collectorsObject = null;
  type = null;
  id = null;
  nfc = null;
  hideSubmit = true;
  showScan = false;

  submitDetails = {
    paymentName: null,
    paymentDescription: null,
    paymentAmount: null,
  };

  constructor(private authService: AuthenticationService,
              private router: Router,
              private api: ApisService,
              private toast: Toast,
              private platform: Platform) {

    this.platform.ready().then(() => {
      NFC.enabled().then(() => {
        this.nfc = 'NFC ENABLED DEVICE';
        this.showScan = true;
      }).catch(() => {
        this.nfc = 'NFC NOT FOUND';
      })
    });
  }


  addListenNFC() {
    NFC.addTagDiscoveredListener(nfcEvent => this.sesReadNFC(nfcEvent.tag)).subscribe(data => {
      if (data && data.tag && data.tag.id) {
        const tagId = NFC.bytesToHexString(data.tag.id);
        if (tagId) {
          this.id = tagId;
          this.clickMe('rfid')
        } else {
          this.toast.show('NFC_NOT_DETECTED', '5000', 'center').subscribe();
        }
      }
    });
  }


  sesReadNFC(data): void {
    this.toast.show('NFC WORKING', '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }


  clickMe(paramType) {
    this.type = paramType;
    this.api.getUserDetails(this.type, this.id)
      .subscribe(response => {
        if (response !== 'error') {
          this.userDetails = response;
          this.show = true;
          this.hideSubmit = false;
        } else {
          this.show = false;
          this.hideSubmit = true;
          this.toast.show('Data Not Found', '5000', 'center').subscribe(() => { });
        }
      }
      );
  }


  onSubmit() {
    const sendDetails = {
      paymentName: this.submitDetails.paymentName,
      paymentType: 'CASH',
      paymentDescription: this.submitDetails.paymentDescription,
      paymentAmount: this.submitDetails.paymentAmount,
      receivedBy: this.collectorsObject,
      timestamp: new Date().getTime(),
      destination: this.collectorsObject,
      received: true,
      sent: false,
      id: this.userDetails.user.ejamat
    };

    const receiveDetails = {
      paymentName: this.submitDetails.paymentName,
      paymentType: 'CASH',
      paymentDescription: this.submitDetails.paymentDescription,
      destination: this.userDetails.user,
      paymentAmount: this.submitDetails.paymentAmount,
      receivedBy: this.collectorsObject,
      timestamp: new Date().getTime(),
      id: this.collectorsObject.division_no,
      received: false,
      sent: true
    };

    this.api.sendData(sendDetails)
      .subscribe(() => {
        this.toast.show('Posted', '5000', 'center').subscribe(() => { });
      });

    this.api.receiveData(receiveDetails)
      .subscribe(() => {
        this.hideSubmit = true;
        this.toast.show('Posted', '5000', 'center').subscribe(() => { });
      });
  }


  ngOnInit() {
    this.api.getEvents()
      .then(response => {
        this.eventDetails = response;
      });

    this.authService.getToken()
      .then(response => {
        this.collectorsObject = response;
      });

  }


  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
