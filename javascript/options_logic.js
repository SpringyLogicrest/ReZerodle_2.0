let CD;
let characters = [];
let characterDivs = [];
let answer = null;
let numOfGuesses = 0;
let alreadyChosenCharacters = [];
let gameSource = 'ln';
let gameType = 'daily';
let gameFinished = false;
let exitLocked = false;
let pendingWinTimeout = null;
let roundToken = 0;

const gameScreen = document.querySelector('#game-screen');
const mainMenu = document.querySelector('#main-menu');
const searchInp = document.querySelector('#character-search');
const options = document.querySelector('.options');
const guessbox = document.querySelector('.guessbox');

window.addEventListener('DOMContentLoaded', () => {
    CD = new CharacterData();
    bindNavigation();
});

function bindNavigation() {
    document.querySelectorAll('[data-screen]').forEach(button => {
        button.addEventListener('click', () => showScreen(button.dataset.screen));
    });

    document.querySelectorAll('[data-start-source]').forEach(button => {
        button.addEventListener('click', () => startGame(button.dataset.startSource, button.dataset.startType));
    });

    document.querySelector('#home-button').addEventListener('click', requestMainMenu);
    // document.querySelector('#game-back-button').addEventListener('click', requestMainMenu);
    document.querySelector('#win-menu-button').addEventListener('click', () => showScreen('main-menu'));
    document.querySelector('#next-endless-button').addEventListener('click', startNextEndlessCharacter);

    searchInp.addEventListener('input', addCharFromSearch);
    searchInp.addEventListener('focus', () => {
        if (!gameFinished) options.style.display = 'block';
    });
    searchInp.addEventListener('keydown', handleKeyboardNavigation);

    document.addEventListener('click', event => {
        if (!options.contains(event.target) && event.target !== searchInp) {
            options.style.display = 'none';
        }
    });
}

function requestMainMenu() {
    if (exitLocked && gameScreen.classList.contains('active-screen')) return;
    showScreen('main-menu');
}

function setExitLocked(locked) {
    exitLocked = locked;

    const homeButton = document.querySelector('#home-button');

    homeButton.disabled = locked;
    homeButton.setAttribute('aria-disabled', String(locked));
    homeButton.classList.toggle('exit-locked', locked);

    const lockMessage = 'Finish the current character before leaving this mode.';
    homeButton.title = locked ? lockMessage : 'Return to main menu';
}

function showScreen(id) {
    if (id !== 'game-screen' && exitLocked && gameScreen.classList.contains('active-screen')) return;
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active-screen'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active-screen');
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (id !== 'game-screen') {
        document.querySelector('#home-button').style.visibility = id === 'main-menu' ? 'hidden' : 'visible';
    } else {
        document.querySelector('#home-button').style.visibility = 'visible';
    }
}

function startGame(source, type, keepEndlessHistory = false) {
    // Cancel any delayed victory callback from the previous round. This also
    // prevents a solved round from firing its win screen after another mode starts.
    if (pendingWinTimeout !== null) {
        clearTimeout(pendingWinTimeout);
        pendingWinTimeout = null;
    }
    roundToken++;

    gameSource = source;
    gameType = type;
    numOfGuesses = 0;
    gameFinished = false;

    if (!keepEndlessHistory || source !== gameSource || type !== 'endless') {
        alreadyChosenCharacters = [];
    }

    answer = type === 'daily'
        ? CD.getDailyCharacter(source)
        : CD.getRandomCharacter(source, alreadyChosenCharacters);

    if (!answer) {
        // The endless pool has been exhausted. Start a fresh run.
        alreadyChosenCharacters = [];
        answer = CD.getRandomCharacter(source, []);
    }

    if (type === 'endless' && answer && !alreadyChosenCharacters.includes(answer)) {
        alreadyChosenCharacters.push(answer);
    }

    characters = getCharacterPool(source);

    resetGameUI();
    updateModeLabels();
    setExitLocked(true);
    showScreen('game-screen');

    requestAnimationFrame(() => searchInp.focus());
}

function startNextEndlessCharacter() {
    startGame(gameSource, 'endless', true);
}

function resetGameUI() {
    guessbox.style.display = 'flex';
    searchInp.value = '';
    options.innerHTML = '';
    options.style.display = 'none';
    document.querySelector('.user-answer').innerHTML = '';
    document.querySelector('.guessed-answers-header').style.display = 'none';
    document.querySelector('.win-screen').style.display = 'none';
    document.querySelector('#next-endless-button').style.display = gameType === 'endless' ? 'block' : 'none';
    characterDivs = [];
}

function updateModeLabels() {
    if (gameSource === 'beako-otto') {
        document.querySelector('#game-mode-label').textContent = 'Beako or Otto-bro? • Daily';
        document.querySelector('#game-title').textContent = 'Is today Beako or Otto-bro?';
        return;
    }

    const sourceName = gameSource === 'anime' ? 'Anime Only' : 'English Light Novel';
    const typeName = gameType === 'daily' ? 'Daily Character' : 'Endless / Random';
    document.querySelector('#game-mode-label').textContent = `${sourceName} • ${typeName}`;
    document.querySelector('#game-title').textContent = gameType === 'daily'
        ? "Guess today's Re:Zero character!"
        : 'Guess the random Re:Zero character!';
}

function addCharacter(list) {
    characterDivs = [];
    list.forEach(char => {
        const div = document.createElement('div');
        div.className = 'character-item';
        const button = document.createElement('button');
        button.className = 'character-select';
        button.type = 'button';

        const imgWrap = document.createElement('div');
        const img = document.createElement('img');
        img.src = `img/Character-Portraits/${encodeURIComponent(char)}.png`;
        img.alt = '';
        img.loading = 'lazy';
        imgWrap.appendChild(img);

        const name = document.createElement('div');
        name.textContent = char;
        button.append(imgWrap, name);
        div.appendChild(button);
        div.addEventListener('click', () => updateChoice(div, char));

        options.appendChild(div);
        characterDivs.push(div);
    });
}

function addCharFromSearch() {
    const searchVal = searchInp.value.trim().toLowerCase();
    options.innerHTML = '';

    if (!searchVal) {
        characterDivs = [];
        options.style.display = 'none';
        return;
    }

    const arr = characters.filter(name => {
        const lower = name.toLowerCase();
        return lower.split(' ').some(word => word.startsWith(searchVal)) || lower.startsWith(searchVal);
    });

    if (arr.length === 0) {
        options.innerHTML = '<p>No character found!</p>';
    } else {
        addCharacter(arr);
    }
    options.style.display = 'block';
}

function handleKeyboardNavigation(event) {
    if (!['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) return;
    event.preventDefault();

    if (event.key === 'Enter') {
        if (characterDivs.length === 0) return;
        const selected = options.querySelector('.character-item.selected');
        (selected || characterDivs[0]).click();
        return;
    }

    if (characterDivs.length === 0) return;
    const selected = options.querySelector('.character-item.selected');
    let index = selected ? characterDivs.indexOf(selected) : (event.key === 'ArrowDown' ? -1 : 0);
    index = event.key === 'ArrowDown'
        ? (index + 1) % characterDivs.length
        : (index - 1 + characterDivs.length) % characterDivs.length;

    clearSelections();
    characterDivs[index].classList.add('selected');
    characterDivs[index].scrollIntoView({ block: 'nearest' });
}

function clearSelections() {
    options.querySelectorAll('.character-item.selected').forEach(div => div.classList.remove('selected'));
}

function updateChoice(div, character) {
    if (gameFinished || !characters.includes(character)) return;

    document.querySelector('.guessed-answers-header').style.display = 'block';
    numOfGuesses++;
    alreadyChosenCharacters.push(character);
    characters = characters.filter(item => item !== character);
    searchInp.value = '';
    options.innerHTML = '';
    options.style.display = 'none';
    characterDivs = [];

    addGuessToDiv(CD.characterGuess(answer, character), CD.loadCharacterStats(character));
}

function addGuessToDiv(guessData, characterData) {
    const GD = guessData;
    const CDData = characterData;

    const answersDiv = document.querySelector('.user-answer');
    const squareContent = [
        `img/Character-Portraits/${encodeURIComponent(CDData.Character)}.png`,
        CDData.Gender, CDData.Race, CDData.Height, CDData.Age, CDData.Afiliation,
        CDData['Elemental Affinity'], CDData['Divine Protection'], CDData['Authority']
    ];
    const info = ['Gender', 'Race', 'Height', 'Age', 'Afiliation', 'Elemental Affinity', 'Divine Protection', 'Authority'];

    const container = document.createElement('div');
    container.className = 'square-container';
    const animatedDivs = [];

    squareContent.forEach((content, i) => {
        const square = document.createElement('div');
        square.className = 'square square-answer-tile';
        const contentDiv = document.createElement('div');
        contentDiv.className = 'square-content';

        if (i === 0) {
            const img = document.createElement('img');
            img.src = content;
            img.alt = CDData.Character;
            contentDiv.appendChild(img);
        } else {
            square.classList.add('box-animation', 'active', 'animation-fix');
            contentDiv.textContent = content;
            if (GD[info[i - 1]] === 'incorrect') square.classList.add('guess-incorrect');
            if (GD[info[i - 1]] === 'partial') square.classList.add('guess-partial');
            if (GD[info[i - 1]] === 'correct') square.classList.add('guess-correct');
            animatedDivs.push(square);
        }

        square.appendChild(contentDiv);
        container.appendChild(square);
    });

    answersDiv.prepend(container);

    animatedDivs.forEach((div, index) => {
        setTimeout(() => div.classList.remove('active'), index * 700 + 100);
        setTimeout(() => {
            div.classList.remove('animation-fix');
            if (index === 3) addArrow(div, GD.AgeArrow);
            if (index === 2) addArrow(div, GD.HeightArrow);
        }, index * 700 + 450);
    });

    if (GD.Guess === 'correct') {
        const solvedRoundToken = roundToken;
        pendingWinTimeout = setTimeout(() => {
            pendingWinTimeout = null;
            if (solvedRoundToken !== roundToken) return;
            correctGuessTriggered();
        }, 5000);
    }
}

function addArrow(div, direction) {
    div.classList.remove('square-up', 'square-down', 'square-unknown');
    if (direction === 'higher') div.classList.add('square-up');
    else if (direction === 'lower') div.classList.add('square-down');
    else if (direction === 'undefined') div.classList.add('square-unknown');
}

function correctGuessTriggered() {
    if (gameFinished) return;
    gameFinished = true;
    setExitLocked(false);
    options.style.display = 'none';
    guessbox.style.display = 'none';

    const winningDiv = document.querySelector('.win-screen');
    winningDiv.style.display = 'flex';
    loadWinningDiv();

    if (gameType === 'endless') {
        document.querySelector('.timer-info').style.display = 'none';
        document.querySelector('#next-endless-button').style.display = 'block';
    } else {
        document.querySelector('.timer-info').style.display = 'block';
    }
    winningDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function loadWinningDiv() {
    const winningDiv = document.querySelector('.win-screen');
    winningDiv.querySelector('.win-answer')?.remove();
    winningDiv.querySelector('.nb-trys')?.remove();

    const imgtextdiv = document.createElement('div');
    imgtextdiv.className = 'win-answer';

    const imgdiv = document.createElement('div');
    const portrait = document.createElement('img');
    portrait.src = `img/Character-Portraits/${encodeURIComponent(answer)}.png`;
    portrait.alt = answer;
    imgdiv.appendChild(portrait);

    const textdiv = document.createElement('div');
    const spanElement = document.createElement('span');
    const spanElement2 = document.createElement('span');
    spanElement.className = 'win-answer-text';
    spanElement2.className = 'win-answer-name';
    spanElement.textContent = 'You guessed';
    spanElement2.textContent = answer;
    textdiv.append(spanElement, document.createElement('br'), spanElement2);

    imgtextdiv.append(imgdiv, textdiv);
    const nbdiv = document.createElement('div');
    nbdiv.className = 'nb-trys';
    nbdiv.textContent = `You took ${numOfGuesses} ${numOfGuesses === 1 ? 'try' : 'tries'}`;

    winningDiv.insertBefore(imgtextdiv, winningDiv.querySelector('.timer-info'));
    winningDiv.insertBefore(nbdiv, winningDiv.querySelector('.timer-info'));
}
