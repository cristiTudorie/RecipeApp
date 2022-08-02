import { Component, OnDestroy, OnInit } from '@angular/core';
import {
	UntypedFormArray,
	UntypedFormControl,
	UntypedFormGroup,
	Validators
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, Subscription } from 'rxjs';
import * as RecipesAction from '../store/recipes.action';

@Component({
	selector: 'app-recipe-edit',
	templateUrl: './recipe-edit.component.html',
	styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
	editMode = false;
	id: number;
	recipeForm: UntypedFormGroup;

	private storeSub: Subscription;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private store: Store<fromApp.AppState>
	) {}

	ngOnInit(): void {
		this.route.params.subscribe((params: Params) => {
			this.id = +params['id'];
			this.editMode = params['id'] != null;
			this.initForm();
		});
	}

	onSubmit() {
		if (this.editMode) {
			this.store.dispatch(
				new RecipesAction.UpdateRecipe({
					index: this.id,
					newRecipe: this.recipeForm.value
				})
			);
		} else {
			this.store.dispatch(new RecipesAction.AddRecipe(this.recipeForm.value));
		}
		this.onCancel();
	}

	onAddIngredient() {
		(<UntypedFormArray>this.recipeForm.get('ingredients')).push(
			new UntypedFormGroup({
				name: new UntypedFormControl(null, Validators.required),
				amount: new UntypedFormControl(null, [
					Validators.required,
					Validators.pattern(/^[1-9]+[0-9]*$/)
				])
			})
		);
	}

	onDeleteIngredient(index: number) {
		(<UntypedFormArray>this.recipeForm.get('ingredients')).removeAt(index);
	}

	onCancel() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}

	private initForm() {
		let recipeName = '';
		let recipeImagePath = '';
		let recipeDescription = '';
		let recipeIngredients = new UntypedFormArray([]);

		if (this.editMode) {
			// const recipe = this.recipeService.getRecipe(this.id);
			this.storeSub = this.store
				.select('recipes')
				.pipe(
					map(recipeState => {
						return recipeState.recipes.find((recipe, index) => {
							return index === this.id;
						});
					})
				)
				.subscribe(recipe => {
					recipeName = recipe.name;
					recipeImagePath = recipe.imagePath;
					recipeDescription = recipe.description;

					if (recipe['ingredients']) {
						for (let ingredient of recipe.ingredients) {
							recipeIngredients.push(
								new UntypedFormGroup({
									name: new UntypedFormControl(
										ingredient.name,
										Validators.required
									),
									amount: new UntypedFormControl(ingredient.amount, [
										Validators.required,
										Validators.pattern(/^[1-9]+[0-9]*$/)
									])
								})
							);
						}
					}
				});
		}

		this.recipeForm = new UntypedFormGroup({
			name: new UntypedFormControl(recipeName, Validators.required),
			description: new UntypedFormControl(
				recipeDescription,
				Validators.required
			),
			imagePath: new UntypedFormControl(recipeImagePath, Validators.required),
			ingredients: recipeIngredients
		});
	}

	get controls() {
		// a getter!
		return (<UntypedFormArray>this.recipeForm.get('ingredients')).controls;
	}
	ngOnDestroy(): void {
		if (this.storeSub) this.storeSub.unsubscribe();
	}
}
