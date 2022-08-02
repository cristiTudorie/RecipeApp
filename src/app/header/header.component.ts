import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipes.action';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html'
})
export class HeaderComponent {
	isAuthenticated = false;
	private userSub: Subscription;

	constructor(private store: Store<fromApp.AppState>) {}

	ngOnInit() {
		this.userSub = this.store
			.select('auth')
			.pipe(map(authState => authState.user))
			.subscribe(user => {
				this.isAuthenticated = !!user;
				console.log(!user);
				console.log(!!user);
			});
	}

	onSaveData() {
		this.store.dispatch(new RecipeActions.StoreRecipes());
	}

	onFetchData() {
		this.store.dispatch(new RecipeActions.FetchRecipes());
	}

	onLogout() {
		this.store.dispatch(new AuthActions.Logout());
	}

	ngOnDestroy() {
		this.userSub.unsubscribe();
	}
}
