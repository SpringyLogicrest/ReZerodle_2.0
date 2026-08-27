/*
 * Character pools
 * ----------------
 * THIS is the file you should edit when you sort the characters.
 *
 * Put every anime-safe character in animeCharacters.
 * Put every English-light-novel character in lightNovelCharacters.
 *
 * For now both pools default to the complete database so the refactor is
 * playable immediately. Replace these arrays with your sorted lists.
 */

const allCharacterNames = allCharacterInfo.map(character => character[0]);

const animeCharacters = [
    'Subaru Natsuki',
    'Emilia',
    'Rem',
    'Ram',
    'Beatrice',
    'Roswaal L Mathers',
    'Puck',
    'Otto Suwen',
    'Garfiel Tinsel',
    'Frederica Baumann',
    'Petra Leyte',
    'Meili Portroute',
    'Patrasche',
    'Frufoo',
    'Ryuzu',
    'Crusch Karsten',
    'Felix Argyle',
    'Wilhelm van Astrea',
    'Priscilla Barielle',
    'Aldebaran',
    'Schult',
    'Heinkel Astrea',
    'Anastasia Hoshin',
    'Julius Juukulius',
    'Joshua Juukulius',
    'Ricardo Welkin',
    'Mimi Pearlbaton',
    'Hetaro Pearlbaton',
    'Tivey Pearlbaton',
    'Eridna',
    'Felt',
    'Reinhard van Astrea',
    'Valga Cromwell (Rom)',
    'Gaston',
    'Rachins Hoffman',
    'Camberley',
    'Kadomon Risch',
    'Kiritaka Muse',
    'Reid Astrea',
    'Theresia van Astrea',
    'Volcanica',
    'Shaula',
    'Liliana Masquerade',
    'Fortuna',
    'Arch Elior',
    'Kurgan',
    'Elsa Granhiert',
    'Petelgeuse Romanée-Conti',
    'Regulus Corneas',
    'Sirius Romanée-Conti',
    'Capella Emerada Lugunica',
    'Lye Batenkaitos',
    'Roy Alphard',
    'Rui Arneb',
    'Pandora',
    'Satella',
    'Echidna',
    'Minerva',
    'Sekhmet',
    'Daphne',
    'Typhon',
    'Carmilla',
    'Hector',
    'Kenichi Natsuki',
    'Naoko Natsuki'
    ];
const lightNovelCharacters = [...animeCharacters,
    'Vincent Vollachia',
    'Stride Vollachia',
    'Cecilus Segmunt',
    'Arakiya',
    'Olbart Dunkelkenn',
    'Chisha Gold',
    'Goz Ralfon',
    'Groovy Gumlet',
    'Yorna Mishigure',
    'Moguro Hagane',
    'Madelyn Eschart',
    'Balleroy Temeglyph',
    'Miles',
    'Kafma Irulux',
    'Jamal Aurélie',
    'Todd Fang',
    "Flop O'Connell",
    "Medium O'Connell",
    'Rowan Segmunt',
    'Taritta Shudrak',
    'Tanza',
    'Katya Aurélie',
    'Halibel',
    'Omega',
    'Sphinx',
    'Leilani Alnair',
    'Spica',
    'Flugel',
    'Lamia Godwin',
    'Grimm Fauzen',
    'Carol Remendis',
    'Miklotov McMahon',
    'Bordeaux Zellgef',
    'Marcos Gildark',
    'Russell Fellow',
    'Annarose Miload',
    'Clind',
    'Fourier Lugunica',
    'Farsale Lugunica',
    'Gionis Lugunica',
    'Yae Tenzen',
    'Ubilk'
    ];
const beakoOttoCharacters = ['Beatrice', 'Otto Suwen'];

const characterPools = {
    anime: animeCharacters,
    ln: lightNovelCharacters,
    'beako-otto': beakoOttoCharacters
};

function getCharacterPool(source) {
    const pool = characterPools[source];
    if (!pool || pool.length === 0) {
        throw new Error(`Character pool "${source}" is empty.`);
    }
    return [...new Set(pool)];
}
