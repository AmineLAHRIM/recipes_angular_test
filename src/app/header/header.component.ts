import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestapiService} from '../api/restapi.service';
import {AuthService} from '../auth/auth.service';
import {User} from '../auth/user';
import {Subscription} from 'rxjs';
import {RecipeService} from '../recipes/recipe.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

    isAuthentication = false;
    private userSub: Subscription;

    constructor(private restApiService: RestapiService, private authService: AuthService, private  recipeService: RecipeService) {
    }


    onFetchData() {
        this.restApiService.findAllRecipies().subscribe();
        /*this.restApiService.findAllRecipies().subscribe(recipes => {
            this.recipeService.setRecipes(recipes);
        });*/
    }

    ngOnInit(): void {
        this.userSub = this.authService.userSubject.subscribe((user: User) => {
            if (user != null) {
                this.isAuthentication = true;
            } else {
                this.isAuthentication = false;
            }
        });
    }


    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }

    logout() {
        this.authService.logout();
        //this.isAuthentication = false;

    }
}
