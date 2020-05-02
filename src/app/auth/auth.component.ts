import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthResonseData, AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
    isLoginMode = false;
    isLoged = false;
    isLoading = false;
    error: string;
    authForm: FormGroup;


    constructor(private authService: AuthService, private router: Router) {
    }

    ngOnInit() {
        this.authForm = new FormGroup({
            email: new FormControl(null, [Validators.required, Validators.email]),
            password: new FormControl(null, Validators.required)
        });
    }

    onSwitchToLogin() {
        this.isLoginMode = !this.isLoginMode;

    }


    onSubmit() {
        this.isLoading = true;
        this.error = null;
        let authObs: Observable<AuthResonseData>;

        if (this.isLoginMode) {
            console.log('signIn');
            authObs = this.authService.signIn(this.authForm.value.email, this.authForm.value.password);
        } else {
            console.log('signUP');

            authObs = this.authService.signUp(this.authForm.value.email, this.authForm.value.password);
        }

        authObs.subscribe(value => {
            this.isLoading = false;
            if (this.isLoading) {
                this.isLoged = true;
            }
            this.router.navigate(['/recipes']);
        }, errorMessage => {

            this.isLoading = false;
            this.error = errorMessage;
        });
    }
}
