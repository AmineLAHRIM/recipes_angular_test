import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, throwError} from 'rxjs';
import {User} from './user';

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

    constructor(private httpClient: HttpClient) {
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

    handleAuth(email: string, userId: string, token: string, expirationIn: string) {
        console.log('handleAuth');
        const expirationDate = new Date(new Date().getTime() + Number(expirationIn) * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.userSubject.next(user);
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
    }
}
