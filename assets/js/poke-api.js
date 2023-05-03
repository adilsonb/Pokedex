const pokeapi = {};
function convertDetailsToPokemon(pokemonDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokemonDetail.id;
    pokemon.name = pokemonDetail.name;

    const types = pokemonDetail.types.map((typeList) => typeList.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    pokemon.image = pokemonDetail.sprites.other.dream_world.front_default;

    return pokemon;
}

pokeapi.getPokemonDetails = async (pokemonDetailsURL) => {

    return fetch(pokemonDetailsURL.url)
        .then((response) => response.json())
        .then(convertDetailsToPokemon);
}

pokeapi.getPokemons = async (offset = 0, limit = 6) => {

    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeapi.getPokemonDetails))
        .then((detailsRequest) => Promise.all(detailsRequest))
        .then((pokemonDetails) => pokemonDetails)
        .catch((error) => console.error(error));
}