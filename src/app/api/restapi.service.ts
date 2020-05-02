import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import {exhaustMap, map, take, tap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';

export interface RestApiResonseData {
    status: number;
    error: string;
    response: Recipe[];
}

@Injectable({
    providedIn: 'root'
})
export class RestapiService {

    URL = 'http://localhost:3000';

    constructor(private httpClient: HttpClient, private recipeService: RecipeService, private  authService: AuthService) {
    }

//    recipies
    saveRecipies() {
        const recipes = this.recipeService.getRecipes();
        this.httpClient.put(this.URL + '/recipes', recipes).subscribe(value => {
            console.log(value);
        });
    }

    findAllRecipies() {
        return this.authService.userSubject.pipe(
            take(1),
            // for make the nested subscription as the last and returend parent for the function findAllRecipies
            exhaustMap(user => {
                console.log('exhaustMap ');
                if (user == null) {
                    return null;
                }
                return this.httpClient.get<RestApiResonseData>(this.URL + '/recipes',
                    {
                        params: new HttpParams().set('token', user.token)
                    }
                );
            }),

            map((result: RestApiResonseData) => {
                console.log('Map');
                return result.response;
                /*return result.response.map(recipe => {
                    return recipe;
                });*/
            }),

            tap(recipes => {
                console.log('Tap');
                this.recipeService.setRecipes(recipes);
            })
        );
    }

    fetchRecipies() {
        return this.authService.userSubject.pipe(
            take(1),
            exhaustMap(user => {
                return this.httpClient.get<RestApiResonseData>(this.URL + '/recipes');
            }),
            map((value: RestApiResonseData) => {
                return value;
            }), map(value => {
                console.log(value.response);
                this.recipeService.setRecipes(value.response);

            })
        );
    }


}
