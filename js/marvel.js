// URI da API da Marvel utilizada
const API_URI = "http://gateway.marvel.com/v1/public/";

// Atributos necessários para fazer uma chamada a API
const timestamp = "&ts=1604925377534&"; // timestamp
const API_PUB_KEY = "apikey=db94e41bb98e9df0a570c5f1008fc061"; // chave publica
const hash = "&hash=70350c90644ac1f4ed3abe74ec814fd5"; // hash (md5(timestamp + chave privada + chave publica))

// Salvando a div que serve como container para o display de personagens
const charactersContainer = document.getElementById("charactersContainer");

// Adiciona propriedade onclick no botao para carregar mais personagens
var page = 0;
document.getElementById("next-buttom").onclick = function (e) {
    page += 20;
    getCharacters(page);
}

/**
 * Funcao que lista os personagens do universo Marvel.
 * Faz uma paginacao de no máximo 20 personagens por vez.
 * O Offset é para ir pegando sempre os próximos personagens da lista.
 *
 * @param offset
 */
function getCharacters(offset = 0) {
    fetch(API_URI + "characters?limit=20&orderBy=name&offset=" + offset + timestamp + API_PUB_KEY + hash)
        .then(response => response.json())
        .then(response => {
            response.data.results.map(character => {
                // So adiciona personagens que possuem uma imagem
                if(character.thumbnail.path.split("/")[10] !== "image_not_available") {
                    console.log(character);

                    // Criando o card de cada personagem
                    const card = document.createElement("div");
                    card.setAttribute("class", "card");

                    // Cria uma tag img com a imagem desse personagem
                    const image = document.createElement("img");
                    image.src = character.thumbnail.path + "/portrait_medium." + character.thumbnail.extension;

                    // Cria uma tag h2 com o nome desse personagem
                    const name = document.createElement("h2");
                    name.textContent = character.name;

                    charactersContainer.appendChild(card);
                    card.appendChild(image);
                    card.appendChild(name);
                }
            });
        });
}

/**
 * Funcao que retorna a imagem do personagem, dado o seu nome.
 *
 * @param characterName
 */
function getCharacterImageByName(characterName) {
    fetch(API_URI + "characters?name=" + characterName + timestamp + API_PUB_KEY + hash)
        .then(response => response.json())
        .then(response => {
            const image = document.createElement('img');
            image.src = response.data.results[0].thumbnail.path + "/portrait_medium." + response.data.results[0].thumbnail.extension;
            console.log(image);
        });
}

//getCharacterImageByName("Black Widow");
// Chama a funcao de listagem de personagems assim que a página carrega
charactersContainer.onload = getCharacters();
