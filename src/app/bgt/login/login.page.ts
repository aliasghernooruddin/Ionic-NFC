import { Component, OnInit } from '@angular/core';
import { ApisService } from '../../services/apis.service'
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  eventDetails=null;
  loginCredentials = {username:null,password:null,role:null}

  constructor(private API:ApisService, private authService: AuthenticationService, private router: Router) {
     
   }

   login(){
     this.API.postLoginObject(this.loginCredentials)
      .subscribe(response => {
        this.authService.login(response)
        this.router.navigate(['home'])
      })
     
   }

  ngOnInit() {
    this.API.getLoginObject()
      .then(response => {
        this.eventDetails = response
      })
  }

}
