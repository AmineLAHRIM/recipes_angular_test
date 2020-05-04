export class User {
    constructor(public email: string, public id: string, private _token: string, private _expirationDate: Date) {
    }

    get token() {
        const a = Date.now();
        const b = this._expirationDate.getDate();
        if (this._expirationDate == null || Date.now() > this._expirationDate.getTime()) {
            return null;
        }
        return this._token;

    }

    get expirationDate(): Date {
        return this._expirationDate;
    }
}
