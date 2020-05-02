import {Injectable} from '@angular/core';
import {Recipe} from './recipe.model';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {RestapiService} from '../api/restapi.service';

@Injectable({
    providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {

    constructor(private restapiService: RestapiService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.restapiService.findAllRecipies();
    }
}
