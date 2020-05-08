import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthResonseData, AuthService} from './auth.service';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AlertComponent} from '../shared/alert/alert.component';
import {PlaceholderDirective} from '../shared/placeholder.directive';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

    isLoginMode = false;
    isLoged = false;
    isLoading = false;
    error: string;
    authForm: FormGroup;
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
    private closeSub: Subscription;

    constructor(private authService: AuthService,
                private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver) {
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
            this.showErrorAlert(this.error);
        });
    }

    onHandleError() {
        this.error = null;
    }

    showErrorAlert(error: string) {

        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
            AlertComponent
        );

        const hostViewContainerRef = this.alertHost.viewContainerRef;

        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = error;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }

    ngOnDestroy(): void {
        if (this.closeSub) {
            this.closeSub.unsubscribe();
        }
    }
}
