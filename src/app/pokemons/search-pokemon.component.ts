import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// RxJS 6
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';

import { PokemonService } from './pokemon.service';
import { Pokemon } from './Pokemon';

@Component({
	selector: 'pokemon-search',
	templateUrl: './search-pokemon.component.html'
})
export class PokemonSearchComponent implements OnInit {

	private searchTerms = new Subject<string>();
	pokemons$: Observable<Pokemon[]>;

	constructor(
		private pokemonsService: PokemonService,
		private router: Router) { }

	// Ajoute un terme de recherche dans le flux de l'Observable 'searchTerms'
	search(term: string): void {
		this.searchTerms.next(term);
	}

	ngOnInit(): void {
		this.pokemons$ = this.searchTerms.pipe(
			// attendre 300ms de pause entre chaque requête
			debounceTime(300),
			// ignorer la recherche en cours si c'est la même que la précédente
			distinctUntilChanged(),
			// on retourne la liste des résultats correpsondant aux termes de la recherche
			switchMap((term: string) => this.pokemonsService.searchPokemon(term)),
		);
	}

	gotoDetail(pokemon: Pokemon): void {
		let link = ['/pokemon', pokemon.id];
		this.router.navigate(link);
	}
}
