const ordinals = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
let activeChallenge = {};

function getInputAnswer(challenge, node0, end=1){
    return Array.from(node0.getElementsByClassName('_3mwuq')).map(input => {
        let answer = input.parentElement.firstChild.innerHTML
        return answer.substring(1, answer.length - end)
    }).join('; ')
}
function getInputAnswer2(challenge, node0){
    return node0.getElementsByClassName('_2pNyl _32bZV Id-Wa')[0].innerHTML;
}
function getMatchAnswer2(challenge, node0){
    const nodes = [...node0.getElementsByClassName('_3fmUm')]
    const dict = {}
    nodes.slice(challenge.pairs.length).forEach(node1 => {
        dict[node1.getAttribute('data-test')] = node1.getElementsByClassName('_231NG')[0].firstChild.innerHTML;
    });
    return (nodes
        .slice(0, challenge.pairs.length)
        .map((node1, index) => `${ordinals[index]}: ${dict[node1.getAttribute('data-test')]}`)
        .join('; '));
}
function getMatchAnswer3(challenge, node0){
    const nodes = [...node0.getElementsByClassName('_3fmUm')]
    const dict = Object.fromEntries(challenge.pairs.map(pair => [pair.fromToken, pair.learningToken]));
    return (nodes
        .slice(0, challenge.pairs.length)
        .map(node1 => {
            const token = node1.getElementsByClassName('_231NG')[0].firstChild.innerHTML;
            return `${token}: ${dict[token]}`;
        })
        .join('; '));
}
function clickChildren(className, children=0){
    Array.from(document.getElementsByClassName(className)).forEach(node0 =>{
        [...node0.children].forEach(node1=>{
            for(let i=0;i<children;i++){
                node1 = node1.firstChild;
            }
            if(node1){
                node1.click();    
            }
        });    
    });
}
function clickNode(className, node, index){
    node.getElementsByClassName(className)[index].click()
}
function fillDict(nodes, dict){
    nodes.forEach(node1 => {
        dict[node1.getElementsByClassName('_231NG')[0].firstChild.innerHTML] = node1;
    });
}
function fillMatch2(challenge, node0){
    const dict = {};
    [...node0.getElementsByClassName('_3fmUm')].forEach(node1 => {
        const data = node1.getAttribute('data-test');
        if(!(data in dict)){
            dict[data] = [];
        }
        dict[data].push(node1)
    })
    Object.values(dict).forEach(nodes => {
        nodes.forEach(node1 => node1.click())
    })
}
function fillMatch3(challenge, node0){
    const nodes = [...node0.getElementsByClassName('_3fmUm')]
    const dict0 = {};
    const dict1 = {};
    fillDict(nodes.slice(0, challenge.pairs.length), dict0);
    fillDict(nodes.slice(challenge.pairs.length), dict1);
    challenge.pairs.forEach(pair => {
        dict0[pair.fromToken].click();
        dict1[pair.learningToken].click();
    });
}
function fillCorrectIndex(challenge, node){
    clickNode('_8dMUn _2cKzl', node, challenge.correctIndex);
}
function fillCorrectOption(challenge, node0){
    const answer = challenge.choices[challenge.correctIndex]
    for (const node1 of node0.getElementsByClassName('_8dMUn _2cKzl')){
        if (node1.lastChild.textContent == answer){
            node1.click()
            break
        }
    }
}
function fillCorrectIndices(challenge, node0){
    const domElements = [...node0.getElementsByClassName('_DVHp')]
    challenge.correctIndices.forEach(ix => domElements[ix].firstChild.firstChild.click());
}
function fillCorrectTokens(challenge, node0){
    if (challenge.correctTokens){
        const container = node0.getElementsByClassName('eSgkc')[0]
        const dict = {}
        Array.from(container.getElementsByClassName('_231NG')).forEach(node1 => {
            const key = node1.firstChild.innerHTML
            if(!(key in dict)){
                dict[key] = [];
            }
            dict[key].push(node1.parentElement);
        })
        const node1 = node0.getElementsByClassName('eSgkc')[0];
        challenge.correctTokens.forEach(token => dict[token].shift().click());
    } else {
        const input = node0.getElementsByClassName('_2OQj6 _3zGeZ _394fY RpiVp')[0]
        input.value = challenge.correctSolutions[0];
        let event = new Event('input', {bubbles: true});
        event.simulated = true;
        if(input._valueTracker){
            input._valueTracker.setValue('');    
        }
        input.dispatchEvent(event);
    }
}
function fillType(challenge, node0, end=1){
    Array.from(node0.getElementsByClassName('_3mwuq')).forEach(input => {
        let answer = input.parentElement.firstChild.innerHTML
        answer = answer.substring(1, answer.length - end)
        input.value = answer;
        let event = new Event('input', {bubbles: true});
        event.simulated = true;
        if(input._valueTracker){
            input._valueTracker.setValue('');    
        }
        input.dispatchEvent(event);
    });
}
function fillType2(challenge, node0, className){
    const editable = node0.getElementsByClassName('_1W1IX')[0];
    editable.innerHTML = document.getElementsByClassName('Id-Wa')[0].innerHTML;
    editable.dispatchEvent(new Event('input', {bubbles: true}));
}
function fillValue(challenge, node0, className){
    const input = node0.getElementsByClassName(className)[0].firstChild;
    input.value = challenge.correctSolutions?.at(0) || challenge.prompt;
    let event = new Event('input', {bubbles: true});
    event.simulated = true;
    if(input._valueTracker){
        input._valueTracker.setValue('');    
    }
    input.dispatchEvent(event);
}

const lessonAnswers = {
    listenTap: challenge => challenge.prompt,
    readComprehension: challenge => challenge.choices[challenge.correctIndex],
    gapFill: challenge => challenge.choices[challenge.correctIndex],
    dialogue: challenge => challenge.choices[challenge.correctIndex],
    definition: challenge => challenge.choices[challenge.correctIndex],
    assist: challenge => challenge.choices[challenge.correctIndex],
    listenComprehension: challenge => challenge.choices[challenge.correctIndex],
    selectTranscription: challenge => challenge.choices[challenge.correctIndex].text,
    select: challenge => challenge.choices[challenge.correctIndex].phrase,
    listenIsolation: challenge => ordinals[challenge.correctIndex],
    tapComplete: challenge => challenge.correctIndices.map(index => challenge.choices[index].text).join('; '),
    tapCloze: challenge => challenge.correctIndices.map(index => challenge.choices[index]).join('; '),
    typeCloze: (challenge, node) => getInputAnswer(challenge, node, 0),
    translate: challenge => challenge.correctSolutions[0],
    listenComplete: getInputAnswer,
    listen: challenge => challenge.prompt,
    name: challenge=> challenge.correctSolutions[0],
    completeReverseTranslation: getInputAnswer,
    partialReverseTranslate: getInputAnswer2,
    match: getMatchAnswer3,
    listenMatch: getMatchAnswer2,
    selectPronunciation: challenge => challenge.choices[challenge.correctIndex].text,
    sameDifferent: challenge => challenge.options[challenge.correctIndex],
}
const lessonCleans = {
    listenTap: () => clickChildren('_2-F7v', 2),
    readComprehension: null,
    gapFill: null,
    dialogue: null,
    definition: null,
    assist: null,
    listenComprehension: null,
    selectTranscription: null,
    select: null,
    listenIsolation: null,
    tapComplete: () => clickChildren('_8g3cL', 3),
    tapCloze: () => Array.from(document.getElementsByClassName('_3Fpm6')).forEach(node => node.click()),
    typeCloze: null,
    translate: () => clickChildren('_2-F7v', 2),
    listenComplete: null,
    listen: null,
    name: null,
    completeReverseTranslation: null,
    partialReverseTranslate: null,
    match: null,
    listenMatch: null,
    selectPronunciation: null,
    sameDifferent: null,
}
const lessonFills = {
    listenTap: fillCorrectTokens,
    readComprehension: fillCorrectIndex,
    gapFill: fillCorrectIndex,
    dialogue: fillCorrectIndex,
    definition: fillCorrectIndex, //fillCorrectOption,
    assist: fillCorrectIndex,
    listenComprehension: fillCorrectIndex,
    selectTranscription: fillCorrectIndex,
    select: fillCorrectIndex,
    listenIsolation: fillCorrectIndex,
    tapComplete: fillCorrectIndices,
    tapCloze: fillCorrectIndices,
    typeCloze: (challenge, node) => fillType(challenge, node, 0),
    translate: fillCorrectTokens,
    listenComplete: fillType,
    listen: (challenge, node) => fillValue(challenge, node, '_3-pGM'),
    name: (challenge, node) => fillValue(challenge, node, '_3l-7L'),
    completeReverseTranslation:fillType,
    partialReverseTranslate: fillType2,
    match: fillMatch3,
    listenMatch: fillMatch2,
    selectPronunciation: fillCorrectIndex,
    sameDifferent: fillCorrectIndex,
}

function initChallenge(node0){
    const node1 = node0.getElementsByClassName('w2K8w')[0];
    if(!session.challenges){
        sessionCallback = () => initChallenge(node0)
        return
    }
    activeChallenge = undefined
    if(node1){
        if(node1.style.color == 'rgb(var(--color-cardinal))'){
            if (session.adaptiveChallenges && hardChallengeIndex < session.adaptiveChallenges.length - 1){
                hardChallengeIndex++
                activeChallenge = session.adaptiveChallenges[hardChallengeIndex];    
            }
        } else if(challengeIndex >= session.challenges.length - 1){
            activeChallenge = errorChallenges.shift();
        }
    } 
    if (!activeChallenge){
        if (challengeIndex >= session.challenges - 1){
            return
        }
        challengeIndex++;
        activeChallenge = session.challenges[challengeIndex];
    }

    const type = node0.getAttribute('data-test').split('-').at(-1);
    if(type != activeChallenge.type && 'adaptiveInterleavedChallenges' in session){
        const obj = session.adaptiveInterleavedChallenges;
        const index = obj.speakOrListenReplacementIndices[challengeIndex];
        activeChallenge = obj.challenges[index];
    }
    if(activeChallenge?.type != type){
        initChallenge(node0)
        return
    }
    if(!(type in lessonAnswers)){
        gs_move.innerHTML = '';
        fillManager.fill = () => {};
        gs_suspend();
        return
    }
    gs_move.innerHTML = lessonAnswers[type](activeChallenge, node0);
    fillManager.clean = lessonCleans[type];
    fillManager.fill = async () => {
        await lessonFills[type](activeChallenge, node0);
        fillManager.continueButton.click();
    }
}

function initLesson(node0){
    challengeIndex = -1;
    addComponentsTriggers(node0, ['_1Mopf'], initChallenge, undefined, undefined, undefined, 'lesson1');
    const footer = document.getElementById('session/PlayerFooter')
    new MutationObserver(records=>{
        if(footer.classList.contains('_2cfV0')){
            errorChallenges.push(activeChallenge);
        }
    }).observe(footer, {attributeFilter: ['class']})
}
addComponentsTriggers(root, ['_2kkzG', '_29gfw', '_3GuWo _1cTBC',], initLesson, 2, undefined, exitCallback, 'lesson0');
