export class User {
    constructor(public email: string, public id, private _token: string, private _expirationDate: Date) {
    }

    get token() {
        if (this._expirationDate == null || Date.now() > this._expirationDate.getDate()) {
            return null;
        }
        return this.token;
    }
}
