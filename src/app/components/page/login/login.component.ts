import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from 'firebase/compat/app';
import auth = firebase.auth;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const email = form.value.email;
      const password = form.value.password;
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(() => this.router.navigate(['/']))
        .catch((error) => console.log(error));
    }
  }

  loginWithGoogle() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => this.router.navigate(['/']))
      .catch((error) => console.log(error));
  }

  loginWithFacebook() {
    this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(() => this.router.navigate(['/']))
      .catch((error) => console.log(error));
  }
}
