
class CharacterData{

    constructor() {
        this.data = allCharacterInfo;
    }

    loadCharacters() {
        return this.data.map(character => character[0]);
    }


    loadCharacter(character){
        return this.data.find(item => item[0].toLowerCase() === character.toLowerCase());
    }

    loadCharacterStats(character){
        var character = this.loadCharacter(character);
        var keys = ['Character', 'Race', 'Gender', 'Elemental Affinity', 'Authority', 'Height', 'Afiliation', 'Divine Protection', 'Age', 'Priority']

        var result = {};
        for (var i = 0; i < keys.length; i++){
            result[keys[i]] = character[i].trim();
        }

        if (result['Elemental Affinity'] == 'nan'){
            result['Elemental Affinity'] = 'N/A';
        }
        
        return result;
    }

    characterGuess(answerName, guessName) {
        const answer = this.loadCharacter(answerName);
        const guess = this.loadCharacter(guessName);

        if (!answer || !guess) {
            throw new Error('One or both characters not found.');
        }

        const data = {};

        // Comparison functions
        const checkPartial = (a, b) => {
            const answer = new Set(a.split(',').map(item => item.trim().toLowerCase()));
            const guess = new Set(b.split(',').map(item => item.trim().toLowerCase()));

            if (answer.size === 0 && guess.size === 0) return 'incorrect';
            if ([...answer].every(item => guess.has(item)) && [...guess].every(item => answer.has(item))) return 'correct';
            if ([...answer].some(item => guess.has(item)) || [...guess].some(item => answer.has(item))) return 'partial';
            return 'incorrect';
        };

        const compareNumb = (a, b) => {
            const numA = parseInt(a.replace(/\D/g, ''), 10);
            const numB = parseInt(b.replace(/\D/g, ''), 10);

            if (isNaN(numA) || isNaN(numB)) return 'undefined';
            if (numA === numB) return 'correct';
            return numA > numB ? 'higher' : 'lower';
        };

        const answerData = this.loadCharacterStats(answerName);
        const guessData = this.loadCharacterStats(guessName);


        for (const key of ['Character', 'Race', 'Gender', 'Elemental Affinity', 'Authority', 'Height', 'Afiliation', 'Divine Protection', 'Age']) {
            data[key] = answerData[key].toLowerCase() == guessData[key].toLowerCase() ? 'correct' : (key === 'Elemental Affinity' || key === 'Race' ? checkPartial(answerData[key], guessData[key]) : 'incorrect');
        }

        data['AgeArrow'] = compareNumb(answerData['Age'], guessData['Age']);
        data['HeightArrow'] = compareNumb(answerData['Height'], guessData['Height']);

        if (answerName == guessName){
            data['Guess'] = 'correct'
        } else {
            data['Guess'] = 'incorrect'
        }

        return data;
    }

    getDailyCharacter(source = 'ln') {
        if (source === 'beako-otto') {
            return this.getBeakoOrOttoDailyCharacter();
        }

        const pool = getCharacterPool(source);
        const index = this.getCurrentDay(pool.length);
        return pool[index];
    }

    getBeakoOrOttoDailyCharacter() {
        const pool = getCharacterPool('beako-otto'); // index 0 = Beatrice, index 1 = Otto Suwen
        const today = new Date();
        const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-beako-otto`;

        // Stable pseudo-random bit for the current local date. This keeps the
        // answer the same after refreshes and gives both players the same daily
        // result as long as they are on the same calendar date.
        let hash = 2166136261;
        for (let i = 0; i < dateKey.length; i++) {
            hash ^= dateKey.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }

        const randomInteger = (hash >>> 0) % 2;
        return pool[randomInteger];
    }

    getRandomCharacter(source = 'ln', excluded = []) {
        const pool = getCharacterPool(source).filter(character => !excluded.includes(character));
        if (pool.length === 0) return null;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    getCurrentDay(poolLength) {
        const start = new Date('2024-04-28T00:00:00');
        const today = new Date();
        const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        return ((diff + 1) % poolLength + poolLength) % poolLength;
    }

}

var allCharacterInfo = [
    ['Subaru Natsuki', 'Human', 'Male', 'Yin, Water, Wind', 'Yes', '173cm', 'Emilia Camp', 'No', '17', 'T'],
    ['Emilia', 'Human, Elf', 'Female', 'Fire, Water, Wind, Earth', 'No', '164cm', 'Emilia Camp', 'No', '114', 'T'],
    ['Rem', 'Oni', 'Female', 'Water', 'No', '154cm', 'Emilia Camp', 'No', '18', 'T'],
    ['Beatrice', 'Spirit', 'Female', 'Yin, Water, Wind', 'No', '130cm', 'Emilia Camp', 'No', '400+', 'T'],
    ['Ram', 'Oni', 'Female', 'Wind', 'No', '154cm', 'Emilia Camp', 'No', '18', 'T'],
    ['Roswaal L Mathers', 'Human', 'Male', 'Fire, Wind, Water, Earth, Yin, Yang', 'No', '186cm', 'Emilia Camp', 'No', '400+', 'T'],
    ['Roswaal J Mathers', 'Human', 'Female', 'N/A', 'no', 'N/A', 'Royal Capital', 'No', '400+', 'T'],
    ['Puck', 'Spirit', 'Male', 'Fire', 'No', '9cm', 'Emilia Camp', 'No', '400+', 'T'],
    ['Garfiel Tinsel', 'Human, Beast', 'Male', 'Earth', 'No ', '160cm', 'Emilia Camp', 'Yes', '14', 'T'],
    ['Otto Suwen', 'Human', 'Male', 'Earth', 'No', '177cm', 'Emilia Camp', 'Yes', '20', 'T'],
    ['Frederica Baumann', 'Human, Beast', 'Female', 'Wind', 'No', '180cm', 'Emilia Camp', 'No', '20', 'T'],
    ['Petra Leyte', 'Human', 'Female', 'Yang', 'No', '140cm', 'Emilia Camp', 'No', '12', 'T'],
    ['Ryuzu', 'Human, Elf', 'Female', 'N/A', 'No', '135cm', 'Emilia Camp', 'No', '400+', 'T'],
    ['Annarose Miload', 'Human', 'Female', 'N/A', 'No', '135cm', 'Emilia Camp', 'No', '9', 'F'],
    ['Clind', 'Unknown', 'Male', 'N/A', 'Yes', '178cm', 'Emilia Camp', 'No', '400+', 'T'],
    ['Meili Portroute', 'Human', 'Female', 'N/A', 'No', '145cm', 'Emilia Camp', 'Yes', '13', 'T'],
    ['Patrasche', 'Ground Dragon', 'Female', 'NA', 'No', 'Unknown', 'Emilia Camp', 'Yes', 'Unknown', 'T'],
    ['Frufoo', 'Ground Dragon', 'Female', 'N/A', 'No', 'Unknown', 'Emilia Camp', 'Yes', '23', 'F'],
    ['Crusch Karsten', 'Human', 'Female', 'Wind', 'No', '168cm', 'Crusch Camp', 'Yes', '20', 'T'],
    ['Felix Argyle', 'Human, Beast', 'Male', 'Water', 'No', '172cm', 'Crusch Camp', 'Yes', '19', 'T'],
    ['Wilhelm van Astrea', 'Human', 'Male', 'N/A', 'No', '178cm', 'Crusch Camp', 'No', '61', 'T'],
    ['Priscilla Barielle', 'Human', 'Female', 'Yang', 'No', '164cm', 'Priscilla Camp', 'Yes', '19', 'T'],
    ['Aldebaran', 'Human', 'Male', 'Earth', 'Yes', '173cm', 'Priscilla Camp', 'No', '40', 'T'],
    ['Schult', 'Human', 'Male', 'N/A', 'No', '130cm', 'Priscilla Camp', 'No', '11', 'F'],
    ['Heinkel Astrea', 'Human', 'Male', 'N/A', 'No', '185cm', 'Priscilla Camp', 'No', '39', 'T'],
    ['Anastasia Hoshin', 'Human', 'Female', 'Yang', 'No', '155cm', 'Anastasia Camp', 'No', '22', 'T'],
    ['Julius Juukulius', 'Human', 'Male', 'Fire, Wind, Water, Earth, Yin, Yang', 'No', '179cm', 'Anastasia Camp', 'Yes', '21', 'T'],
    ['Joshua Juukulius', 'Human', 'Male', 'Water', 'No', '173cm', 'Anastasia Camp', 'No', '17', 'T'],
    ['Ricardo Welkin', 'Demi-Human', 'Male', 'N/A', 'No', '206cm', 'Anastasia Camp', 'No', '39', 'T'],
    ['Mimi Pearlbaton', 'Human, Beast', 'Female', 'Earth, Water', 'No', '110cm', 'Anastasia Camp', 'Yes', '14', 'T'],
    ['Hetaro Pearlbaton', 'Human, Beast', 'Male', 'Water', 'No', '110cm', 'Anastasia Camp', 'Yes', '14', 'T'],
    ['Tivey Pearlbaton', 'Human, Beast', 'Male', 'Fire', 'No', '110cm', 'Anastasia Camp', 'Yes', '14', 'T'],
    ['Eridna', 'Spirit', 'Female', 'Yang', 'No', 'Unknown', 'Anastasia Camp', 'No', '400+', 'T'],
    ['Shaknar', 'Ground Dragon', 'Male', 'N/A', 'No', 'Unknown', 'Anastasia Camp', 'Yes', 'Unknown', 'F'],
    ['Felt', 'Human', 'Female', 'N/A', 'No', '150cm', 'Felt Camp', 'Yes', '14', 'T'],
    ['Reinhard van Astrea', 'Human', 'Male', 'N/A', 'No', '184cm', 'Felt Camp', 'Yes', '19', 'T'],
    ['Valga Cromwell (Rom)', 'Giant', 'Male', 'N/A', 'No', '220cm', 'Felt Camp', 'No', '120', 'T'],
    ['Gaston', 'Human', 'Male', 'N/A', 'No', '185cm', 'Felt Camp', 'No', '25', 'F'],
    ['Rachins Hoffman', 'Human', 'Male', 'Fire', 'No', '175cm', 'Felt Camp', 'No', '22', 'F'],
    ['Camberley', 'Dwarf', 'Male', 'N/A', 'No', '130cm', 'Felt Camp', 'Yes', '23', 'F'],
    ['Miklotov McMahon', 'Human', 'Male', 'N/A', 'No', '160cm', 'Royal Capital', 'No', '74', 'F'],
    ['Bordeaux Zellgef', 'Human', 'Male', 'N/A', 'No', 'Unknown', 'Royal Capital', 'No', 'Unknown', 'F'],
    ['Marcos Gildark', 'Human', 'Male', 'Earth', 'No', 'Unknown', 'Royal Capital', 'No', '40', 'F'],
    ['Russell Fellow', 'Human', 'Male', 'N/A', 'No ', '180cm', 'Royal Capital', 'Yes', '29', 'F'],
    ['Kadomon Risch', 'Human', 'Male', 'N/A', 'No', 'Unknown', 'Royal Capital', 'No', 'Unknown', 'F'],
    ['Grimm Fauzen', 'Human', 'Male', 'N/A', 'No', '180cm', 'Royal Capital', 'No', '63', 'T'],
    ['Carol Remendis', 'Human', 'Female', 'N/A', 'No', '164cm', 'Royal Capital', 'No', '62', 'T'],
    ['Kiritaka Muse', 'Human', 'Male', 'N/A', 'No', 'Unknown', 'Pristella', 'No', 'Late 20s', 'F'],
    ['Reid Astrea', 'Human', 'Male', 'N/A', 'No', 'Unknown', 'Lugunica, Witch Era Party', 'No', '400+', 'F'],
    ['Theresia van Astrea', 'Human', 'Female', 'Yang', 'No', '162cm', 'Lugunica', 'Yes', '46', 'T'],
    ['Volcanica', 'Dragon', 'Unknown', 'N/A', 'No', '1500cm', 'Lugunica, Witch Era Party', 'No', '1000+', 'F'],
    ['Shaula', 'Ma Beast', 'Female', 'N/A', 'No', '170cm', 'Pleiades Watchtower', 'No', '400+', 'T'],
    ['Melakuera', 'Spirit', 'Male', 'Fire', 'No', 'Unknown', 'Lugunica', 'No', '400+', 'F'],
    ['Liliana Masquerade', 'Human', 'Female', 'N/A', 'No', '150cm', 'Pristella', 'Yes', '22', 'T'],
    ['Fortuna', 'Elf', 'Female', 'Fire', 'No', '168cm', 'Elior Forest', 'No', 'Unknown', 'T'],
    ['Arch Elior', 'Elf', 'Male', 'Fire, Wind', 'No', '172cm', 'Elior Forest', 'No', 'Unknown', 'F'],
    ['Vincent Vollachia', 'Human', 'Male', 'N/A', 'No', '175cm', 'Vollachia', 'No', '26', 'T'],
    ['Stride Vollachia', 'Human', 'Male ', 'N/A', 'Yes', 'Unknown', 'Vollachia', 'No', '28', 'T'],
    ['Lamia Godwin', 'Human', 'Female', 'N/A', 'No', 'Unknown', 'Vollachia', 'No', '16', 'F'],
    ['Eugard Vollachia', 'Human', 'Male', 'N/A', 'No', 'Unknown', 'Vollachia', 'No', 'Unknown', 'T'],
    ['Cecilus Segmunt', 'Human', 'Male', 'N/A', 'No', 'Unknown', 'Vollachia, Divine General', 'No', '19', 'T'],
    ['Arakiya', 'Human, Beast', 'Female', 'Fire, Wind, Water, Earth, Yin, Yang', 'No', 'Unknown', 'Vollachia, Divine General', 'No', '19', 'T'],
    ['Olbart Dunkelkenn', 'Human', 'Male', 'N/A', 'No', '100cm', 'Vollachia, Divine General', 'No', '98+', 'T'],
    ['Chisha Gold', 'Human', 'Male', 'N/A', 'No', 'Unknown', 'Vollachia, Divine General', 'No', '29', 'T'],
    ['Goz Ralfon', 'Human', 'Male', 'N/A', 'No', 'Unknown', 'Vollachia, Divine General', 'No', 'Unknown', 'T'],
    ['Groovy Gumlet', 'Human, Beast', 'Male', 'N/A', 'No', 'Unknown', 'Vollachia, Divine General', 'No', 'Unknown', 'T'],
    ['Yorna Mishigure', 'Human, Beast', 'Female', 'N/A', 'No', 'Unknown', 'Vollachia, Divine General', 'No', 'Unknown', 'T'],
    ['Moguro Hagane', 'Meteor', 'None', 'N/A', 'No', 'Unknown', 'Vollachia, Divine General', 'No', 'Unknown', 'T'],
    ['Madelyn Eschart', 'Dragonkin', 'Female', 'N/A', 'No', 'Unknown', 'Vollachia, Divine General', 'No', 'Unknown', 'T'],
    ['Balleroy Temeglyph', 'Human', 'Male', 'Yang, Wind', 'No', 'Unknown', 'Vollachia, Divine General', 'No', 'Unknown', 'T'],
    ['Miles', 'Human', 'Male', 'N/A', 'No', '160cm', 'Vollachia', 'No', 'Unknown', 'T'],
    ['Kafma Irulux', 'Insect Cage Clan', 'Male', 'N/A', 'No', 'Unknown', 'Vollachia', 'No', 'Unknown', 'T'],
    ['Jamal Aurélie', 'Human', 'Male', 'N/A', 'No ', 'Unknown', 'Vollachia ', 'No ', 'Unknown', 'F'],
    ['Todd Fang', 'Human, Beast', 'Male', 'N/A', 'No', '180cm', 'Vollachia', 'Yes', 'Unknown', 'T'],
    ['Kurgan', 'Multi-Arm Clan', 'Male', 'N/A', 'No', '213cm', 'Vollachia', 'No', 'Unknown', 'F'],
    ["Flop O'Connell", 'Human', 'Male', 'N/A', 'No', '175cm', 'Vollachia', 'No ', '20', 'F'],
    ["Medium O'Connell", 'Human', 'Female', 'N/A', 'No', '185cm', 'Vollachia', 'Yes', '20', 'F'],
    ['Rowan Segmunt', 'Human', 'Male', 'N/A', 'No', 'Unknown', 'Vollachia', 'No', '50', 'F'],
    ['Taritta Shudrak', 'Shudrak', 'Female', 'N/A', 'No', 'Unknown', 'Vollachia', 'No', 'Unknown', 'F'],
    ['Tanza', 'Human, Beast', 'Female', 'N/A', 'No ', 'Unknown', 'Vollachia', 'No', '11', 'T'],
    ['Katya Aurélie', 'Human', 'Female', 'N/A', 'No ', 'Unknown', 'Vollachia', 'No', 'Unknown', 'F'],
    ['Gustav Morello', 'Multi-Arm Clan', 'Male', 'N/A', 'No', '250cm', 'Vollachia', 'No ', 'Unknown', 'F'],
    ['Halibel', 'Demi-Human', 'Male', 'N/A', 'No', '190cm', 'Kararagi', 'No', '40', 'T'],
    ['Zarestria', 'Spirit', 'Female', 'Wind', 'No', '166cm', 'Kararagi', 'No', '1000+', 'T'],
    ['Rigel Natsuki', 'Human, Oni', 'Male', 'N/A', 'No', 'Unknown', 'Kararagi', 'No', '9', 'F'],
    ['Spica Natsuki', 'Human, Oni', 'Female', 'N/A', 'No', 'Unknown', 'Kararagi', 'No', 'Unknown', 'F'],
    ['Elsa Granhiert', 'Human', 'Female', 'N/A', 'No', '168cm', 'Gusteko', 'No', '23', 'T'],
    ['Petelgeuse Romanée-Conti', 'Spirit', 'Male', 'Earth', 'Yes', '180cm', 'Witch Cult', 'No', '402', 'T'],
    ['Regulus Corneas', 'Human', 'Male', 'N/A', 'Yes', '173cm', 'Witch Cult', 'No', '120+', 'T'],
    ['Sirius Romanée-Conti', 'Elf', 'Female', 'Fire', 'Yes', '168cm', 'Witch Cult', 'No', 'Unknown', 'T'],
    ['Capella Emerada Lugunica', 'Unknown', 'Female', 'N/A', 'Yes', '145cm', 'Witch Cult', 'No', 'Unknown', 'T'],
    ['Leilani Alnair', 'Human', 'Female', 'N/A', 'Yes', 'Unknown', 'Witch Cult', 'No', 'Unknown', 'F'],
    ['Lye Batenkaitos', 'Human', 'Male', 'N/A', 'Yes', '150cm', 'Witch Cult', 'No ', 'Unknown', 'T'],
    ['Roy Alphard', 'Human', 'Male', 'Fire, Wind, Water, Earth, Yin, Yang', 'Yes', '150cm', 'Witch Cult', 'No', 'Unknown', 'T'],
    ['Rui Arneb', 'Human', 'Female', 'Fire, Wind, Water, Earth, Yin, Yang', 'Yes', '140cm', 'Witch Cult', 'No ', 'Unknown', 'T'],
    ['Spica', 'Human', 'Female', 'Fire, Wind, Water, Earth, Yin, Yang', 'Yes', '140cm', 'Vollachia', 'No ', 'Unknown', 'T'],
    ['Pandora', 'Unknown', 'Female', 'N/A', 'Yes', '155cm', 'Witches of Sin', 'No', '400+', 'T'],
    ['Satella', 'Human, Elf', 'Female', 'Yin', 'Yes', '164cm', 'Witches of Sin', 'No', '400+', 'T'],
    ['Echidna', 'Human', 'Female', 'Fire, Wind, Water, Earth, Yin, Yang', 'Yes', '164cm', 'Witches of Sin', 'No', '400+', 'T'],
    ['Minerva', 'Human', 'Female', 'N/A', 'Yes', '155cm', 'Witches of Sin', 'No', '400+', 'T'],
    ['Sekhmet', 'Giant', 'Female', 'N/A', 'Yes', '170cm', 'Witches of Sin', 'No', '400+', 'T'],
    ['Daphne', 'Human', 'Female ', 'N/A', 'Yes', '140cm', 'Witches of Sin', 'No ', '400+', 'T'],
    ['Typhon', 'Human', 'Female', 'N/A', 'Yes', '125cm', 'Witches of Sin', 'No', '400+', 'T'],
    ['Carmilla', 'Human', 'Female', 'N/A', 'Yes', '158cm', 'Witches of Sin', 'No', '400+', 'T'],
    ['Hector', 'Unknown', 'Male', 'N/A', 'Yes', '185cm', 'Warlock of Meloncholy', 'No', '400+', 'T'],
    ['Omega', 'Human, Elf', 'Female', 'Fire, Wind, Water, Earth, Yin, Yang', 'Yes', '135cm', 'Witches of Sin', 'No', '400+', 'T'],
    ['Sphinx', 'Human, Elf', 'Female', 'Fire, Wind, Water, Earth, Yin, Yang', 'No', '135cm', 'Demi-Human Alliance', 'No', '400+', 'T'],
    ['Kenichi Natsuki', 'Human', 'Male', 'N/A', 'No', 'Unknown', 'Japan', 'No', '40+', 'T'],
    ['Naoko Natsuki', 'Human', 'Female', 'N/A', 'No ', 'Unknown', 'Japan', 'No', '40+', 'T'],
    ['Flugel', 'Human', 'Male', 'Unknown', 'Unknown', 'Unknown', 'Pleiades Watchtower, Witch Era Party', 'Unknown', 'Unknown', 'F'],
    ['Fourier Lugunica', 'Human', 'Male', 'N/A', 'No', 'Unknown', 'Royal Capital', 'No', 'Early 20s', 'T'],
    ['Farsale Lugunica', 'Human', 'Male', 'N/A', 'No', 'Unknown', 'Royal Capital, Witch Era Party', 'No', 'Unknown', 'T'],
    ['Gionis Lugunica', 'Human', 'Male', 'N/A', 'No', 'Unknown', 'Royal Capital', 'No', 'Unknown', 'F'],
    ['Yae Tenzen', 'Human', 'Female', 'N/A', 'No', 'Unknown', 'Prscilla Camp, Vollachia', 'No', 'Early 20s', 'T'],
    ['Ubilk', 'Human', 'Male', 'N/A', 'No', 'Unknown', 'Vollachia', 'No', 'Unknown', 'T']]