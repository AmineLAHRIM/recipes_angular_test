import {Ingredient} from '../model/ingredient.model';

export class Recipe {
    public id: number;
    public name: string;
    public description: string;
    public imagePath: string;
    public ingredients: Ingredient[];


    constructor(id: number, name: string, description: string, imagePath: string, ingredients: Ingredient[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imagePath = imagePath;
        this.ingredients = ingredients;
    }
}
