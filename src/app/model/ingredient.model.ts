export class Ingredient {
    private id: number;


    get getId(): number {
        return this.id;
    }

    constructor(public name: string, public amount: number) {
    }
}
