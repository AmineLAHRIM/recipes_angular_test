import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, throwError} from 'rxjs';
import {User} from './user';
import {Router} from '@angular/router';

export interface AuthResonseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;

}

@Injectable({
    providedIn: 'root'
})


export class AuthService {

    userSubject = new BehaviorSubject<User>(null);
    firbaseSignUpUrlAuth = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAc6jXMP9_-ebCmuVJ5pGlod0NGdzXOgr0';
    firbaseSignInUrlAuth = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAc6jXMP9_-ebCmuVJ5pGlod0NGdzXOgr0';
    private tokenExpirationTimer: any;

    constructor(private httpClient: HttpClient, private router: Router) {
    }


    signUp(email: string, password: string) {
        return this.httpClient.post<AuthResonseData>(this.firbaseSignUpUrlAuth,
            {
                email,
                password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap((resData: AuthResonseData) => {
            this.handleAuth(resData.email, resData.localId, resData.idToken, resData.expiresIn);
        }));
    }

    signIn(email: string, password: string) {
        return this.httpClient.post<AuthResonseData>(this.firbaseSignInUrlAuth,
            {
                email,
                password,
                returnSecureToken: true
            }).pipe(catchError(this.handleError), tap((resData: AuthResonseData) => {
            this.handleAuth(resData.email, resData.localId, resData.idToken, resData.expiresIn);
        }));

    }

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _expirationDate: Date
        } = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            const user = new User(userData.email, userData.id, userData._token, new Date(userData._expirationDate));
            if (user.token) {
                this.userSubject.next(user);
                this.autologout(user.expirationDate.getTime());
            }

        }
    }

    handleAuth(email: string, userId: string, token: string, expirationIn: string) {
        const expirationDate = new Date(new Date().getTime() + Number(expirationIn) * 1000);
        const user = new User(email, userId, token, expirationDate);
        localStorage.setItem('userData', JSON.stringify(user));
        this.userSubject.next(user);
        this.autologout(expirationDate.getTime());
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'Unknown Error!!';
        if (errorRes.error != null && errorRes.error.error != null) {
            switch (errorRes.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'email already exists';
                    break;
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'email not found';
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage = 'Invalid password';
                    break;

            }
        }
        console.log(errorMessage);

        return throwError(errorMessage);
    }

    logout() {
        this.userSubject.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
    }

    autologout(expirationDate: number) {
        const timeOutSeconds = (expirationDate - Date.now());
        //const timeOutSeconds = 10000;
        console.log('timeOutSeconds', timeOutSeconds, this.tokenExpirationTimer);
        if (!this.tokenExpirationTimer) {
            this.tokenExpirationTimer = setTimeout(() => {
                console.log('logout');
                this.logout();
            }, timeOutSeconds);
        }

    }
}
