const pokemonList = document.getElementById('pokemonList');
const loadMore = document.getElementById('loadMore');
const urlBase = 'https://pokeapi.co/api/v2/pokemon/';

const maxPokemons = 1281;
const limit = 6;
let offset = 0;

function listPokemon(pokemon) {

    let numberPokemon = ('000' + pokemon.number).slice(-3);

    return `
    <li class="pokemon-card ${pokemon.type}" onclick="getPokemonDetails(${pokemon.number});">       
    <div class="pokemon-number">#${numberPokemon}</div>
    <div class="pokemon-name">${pokemon.name}</div>        
    <div class="pokemon-details">
      
      <div class="pokemon-image">
        <img src="${pokemon.image}" alt="${pokemon.name}">
      </div>

      <ul class="pokemon-types">
        ${pokemon.types.map((type) => `<li class="pokemon-type ${type}">${type}</li>`).join('')}
      </ul>          
    </div>
  </li>            
    `
}

function loadPokemons(offset, limit) {
    pokeapi.getPokemons(offset, limit).then((pokemons = []) => {

        const newPokemonList = pokemons.map(listPokemon).join('');
        pokemonList.innerHTML += newPokemonList;
    });
}

loadPokemons();

loadMore.addEventListener('click', () => {

    offset += limit;

    const checkLimit = offset + limit;

    if (checkLimit >= maxPokemons) {
        const newLimit = maxPokemons - offset;
        loadPokemons(offset, newLimit);
        loadMore.parentElement.removeChild(loadMore);
    } else {
        loadPokemons(offset, limit);
    }

});

/* MORE POKÉMON DETAILS */
let modalContainer = document.getElementById("modal-container");
const card = document.getElementById('pokemonDetailsCard');

window.onresize = function () {
    let modalContainer = document.getElementById("modal-container");
    modalContainer.style.height = window.innerHeight + "px";
    modalContainer.style.width = window.innerWidth + "px";
}

function hideModal() {
    let modalContainer = document.getElementById("modal-container");
    modalContainer.style.display = "none";
    card.innerHTML = "";
}

let getPokemonDetails = (pokemonNumber) => {

    const urlDetails = urlBase + pokemonNumber;
    fetch(urlDetails)
        .then((response) => response.json())
        .then((details) => {
            return generateDetailsCard(details);
        });
};

let generateDetailsCard = async (pokemonDetails) => {

    const detailsCard = new Details();

    detailsCard.number = ('000' + pokemonDetails.id).slice(-3);
    detailsCard.name = pokemonDetails.name;
    const types = pokemonDetails.types.map((typeList) => typeList.type.name);
    const [type] = types;

    detailsCard.types = types;
    detailsCard.type = type;

    detailsCard.image = pokemonDetails.sprites.other.dream_world.front_default;

    detailsCard.height = (pokemonDetails.height) / 10;
    detailsCard.weight = (pokemonDetails.weight) / 10;

    detailsCard.hp = pokemonDetails.stats[0].base_stat;
    detailsCard.attack = pokemonDetails.stats[1].base_stat;
    detailsCard.defense = pokemonDetails.stats[2].base_stat;
    detailsCard.specialAttack = pokemonDetails.stats[3].base_stat;
    detailsCard.specialDefense = pokemonDetails.stats[4].base_stat;
    detailsCard.speed = pokemonDetails.stats[5].base_stat;

    card.innerHTML = `<div class="card-details ${detailsCard.type}">
  <img class="detail-image" src="${detailsCard.image}" alt="${detailsCard.name}">
  <div class="detail-name">${detailsCard.name}</div>
  <div class="detail-number">#${detailsCard.number}</div>
  <div class="detail-types">
    ${detailsCard.types.map((type) => `
    <div class="detail-type">
      <img alt="${type}" title="${type}" src="assets/images/type-icons/${type}.svg">
      <p>${type}</p>
    </div>
    `).join('')}
  </div>

  <div class="detail-stats-title">Base Stats</div>
  <div class="detail-weight-height">
    <span>Weight: ${detailsCard.weight} kg</span>
    <span>Height: ${detailsCard.height} m</span>
  </div>

  <div class="detail-stats-box">

    <div class="detail-stats">
      <p class="detail-stats-value" data-value="${detailsCard.hp}">0</p>
      <p class="detail-stats-type">HP</p>
    </div>

    <div class="detail-stats">
      <p class="detail-stats-value" data-value="${detailsCard.attack}">0</p>
      <p class="detail-stats-type">Attack</p>
    </div>

    <div class="detail-stats">
      <p class="detail-stats-value" data-value="${detailsCard.defense}">0</p>
      <p class="detail-stats-type">Defense</p>
    </div>

    <div class="detail-stats">
      <p class="detail-stats-value" data-value="${detailsCard.specialAttack}">0</p>
      <p class="detail-stats-type">Special Attack</p>
    </div>

    <div class="detail-stats">
      <p class="detail-stats-value" data-value="${detailsCard.specialDefense}">0</p>
      <p class="detail-stats-type">Special Defense</p>
    </div>

    <div class="detail-stats">
      <p class="detail-stats-value" data-value="${detailsCard.speed}">0</p>
      <p class="detail-stats-type">Speed</p>
    </div>
  </div>
</div>`;

    modalContainer.style.display = "flex";

    animateCounter();
}

function animateCounter() {
    const counters = document.querySelectorAll('.detail-stats-value');
    const speed = 20000;

    counters.forEach((counter) => {
        const animate = () => {
            const value = +counter.getAttribute('data-value');
            const data = +counter.innerText;

            const time = value / speed;
            if (data < value) {
                counter.innerText = Math.ceil(data + time);
                setTimeout(animate, 1);
            } else {
                counter.innerText = value;
            }

        }
        animate();
    });
}