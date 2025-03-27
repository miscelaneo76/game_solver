const ordinals = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']

/*function evaluate(data, node0=document.body, resultType=XPathResult.FIRST_ORDERED_NODE_TYPE){
    const data_test = (
        (data + '-challenge-tap-token')
        .split(' ')
        .map(word => `(@data-test="${word}" or
            starts-with(@data-test, "${word} ") or
            contains(@data-test, " ${word} ") or
            substrin
            const dict = {}
        nodes.slice(challenge.pairs.length).forEach(node1 => {
            dict[node1.getAttribute('data-test')] = node1.getElementsByClassName('_231NG')[0].firstChild.innerHTML;
        });

            g(@data-test, string-length(@data-test) - string-length("${word}"))=" ${word}")`)
        .join(' and '));
    return document.evaluate(
        `.//*[${data_test} and not(contains(@class, "_2wryV"))]`,
        node0,
        null,
        resultType,
        null)
}*/
function getInputAnswer(challenge, node){
    const input = node.getElementsByClassName('YQVzO _3mwuq')[0];
    let answer = input.previousSibling.innerHTML
    return answer.substring(1, answer.length -1)
}
function getInputAnswer2(challenge, node){
    return node.getElementsByClassName('_2pNyl _32bZV Id-Wa')[0].innerHTML;
}
function getMatchAnswer(element, node){
    const dict = {}
    element.matches.forEach(match => {
        dict[match.translation] = match.phrase;
    })
    return ([...node.firstChild.lastChild.firstChild.firstChild.getElementsByClassName('_231NG')]
        .map(node1 => {
            const key = node1.firstChild.innerHTML
            return `${key}: ${dict[key]}`
        }).join("<br/>"));
}
function getMatchAnswer2(challenge, node){
    const nodes = [...node.getElementsByClassName('_3fmUm')]
    const dict = {}
    nodes.slice(challenge.pairs.length).forEach(node1 => {
        dict[node1.getAttribute('data-test')] = node1.getElementsByClassName('_231NG')[0].firstChild.innerHTML;
    });
    return (nodes
        .slice(0, challenge.pairs.length)
        .map((node1, index) => `${ordinals[index]}: ${dict[node1.getAttribute('data-test')]}`)
        .join('; '));
}
function getMatchAnswer3(challenge, node){
    const nodes = [...node.getElementsByClassName('_3fmUm')]
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
            node1.click()
        });    
    });
}

function fillMatch(element, node){
    return () => {
        const dict = {}
        element.matches.forEach(match => {
            dict[match.translation] = match.phrase;
        });
        const node0 = node.firstChild.lastChild.firstChild
        const dict1 = {};
        [...node0.lastChild.getElementsByClassName('_231NG')].forEach(node1 => {
            const key = node1.firstChild.innerHTML;
            dict1[key] = node1.parentElement
        });
        [...node0.firstChild.getElementsByClassName('_231NG')].forEach(node1 => {
            const key = node1.firstChild.innerHTML;
            if(!node1.parentElement.classList.contains('_2wryV')){
                node1.parentElement.click();
                dict1[dict[key]].click();
            }
        });
    }
}
function fillMatch2(challenge, node0){
    return () => {
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
}
function fillDict(nodes, dict){
    nodes.forEach(node1 => {
        dict[node1.getElementsByClassName('_231NG')[0].firstChild.innerHTML] = node1;
    });
}
function fillMatch3(challenge, node0){
    return () => {
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
}

function clickNode(className, node, index){
    node.getElementsByClassName(className)[index].click()
}
function fillArrange(element, node){
    return () => {
        const nodes = [...node.getElementsByClassName('_3fmUm')];
        const indexes = element.phraseOrder;
        const start = indexes.length - nodes.length
        for(let i=start;i<indexes.length;i++){
            let index = indexes[i] 
            index -= indexes.filter((ix,j) => j < start && ix < index).length
            nodes[index].click();
        }
    }
}
function fillCorrectIndex(challenge, node){
    return () => clickNode('_8dMUn _2cKzl', node, challenge.correctIndex);
}
function fillCorrectIndices(challenge, node){
    return () => {
        const domElements = [...node.getElementsByClassName('_DVHp')]
        challenge.correctIndices.forEach(ix => domElements[ix].firstChild.firstChild.click());
    }
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
        return () => challenge.correctTokens.forEach(token => dict[token].shift().click());
    } else {
        return () => {
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
}
function fillType(challenge, node){
    return () => {
        const input = node.getElementsByClassName('YQVzO _3mwuq')[0];
        let answer = input.previousSibling.innerHTML
        answer = answer.substring(1, answer.length -1)
        input.value = answer;
        let event = new Event('input', {bubbles: true});
        event.simulated = true;
        if(input._valueTracker){
            input._valueTracker.setValue('');    
        }
        input.dispatchEvent(event);
    }
}
function fillType2(challenge, node, className){
    return () => {
        const editable = node.getElementsByClassName('_1W1IX')[0];
        editable.innerHTML = document.getElementsByClassName('Id-Wa')[0].innerHTML;
        editable.dispatchEvent(new Event('input', {bubbles: true}));
    }
}
function fillValue(challenge, node, className){
    return () => {
        const input = node.getElementsByClassName(className)[0].firstChild;
        input.value = challenge.correctSolutions?.at(0) || challenge.prompt;
        let event = new Event('input', {bubbles: true});
        event.simulated = true;
        if(input._valueTracker){
            input._valueTracker.setValue('');    
        }
        input.dispatchEvent(event);
    }
}

const answers = {
    SELECT_PHRASE: element => element.answers[element.correctAnswerIndex],
    MULTIPLE_CHOICE: element => element.answers[element.correctAnswerIndex].text,
    POINT_TO_PHRASE: (element, node) => node.getElementsByClassName('_231NG')[element.correctAnswerIndex].firstChild.innerHTML,
    ARRANGE: element => element.phraseOrder.map(index => element.selectablePhrases[index]).join(' '),
    MATCH: getMatchAnswer,
    //TYPE_TEXT: () => null,
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
    translate: challenge => challenge.correctSolutions[0],
    listenComplete: getInputAnswer,
    listen: challenge => challenge.prompt,
    name: challenge=> challenge.correctSolutions[0],
    completeReverseTranslation: getInputAnswer,
    partialReverseTranslate: getInputAnswer2,
    speak: getInputAnswer,
    match: getMatchAnswer3,
    listenMatch: getMatchAnswer2,
}
const cleans = {
    MULTIPLE_CHOICE: null,
    POINT_TO_PHRASE: null,
    SELECT_PHRASE: null,
    ARRANGE: null,
    MATCH: null,
    //TYPE_TEXT: null,
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
    translate: () => clickChildren('_2-F7v', 2),
    listenComplete: null,
    listen: null,
    name: null,
    completeReverseTranslation: null,
    partialReverseTranslate: null,
    speak: null,
    match: null,
    listenMatch: null,
}
const fills = {
    SELECT_PHRASE: (element, node) => () => clickNode('_1YnrO _2qc6a', node, element.correctAnswerIndex),
    MULTIPLE_CHOICE: (element, node) => () => clickNode('_1NTQa', node, element.correctAnswerIndex),
    POINT_TO_PHRASE: (element, node) => () => clickNode('_1R3Iz', node, element.correctAnswerIndex),
    ARRANGE: fillArrange,
    MATCH: fillMatch,
    //TYPE_TEXT: () => null,
    listenTap: fillCorrectTokens,
    readComprehension: fillCorrectIndex,
    gapFill: fillCorrectIndex,
    dialogue: fillCorrectIndex,
    definition: fillCorrectIndex,
    assist: fillCorrectIndex,
    listenComprehension: fillCorrectIndex,
    selectTranscription: fillCorrectIndex,
    select: fillCorrectIndex,
    listenIsolation: fillCorrectIndex,
    tapComplete: fillCorrectIndices,
    translate: fillCorrectTokens,
    listenComplete: fillType,
    listen: (challenge, node) => fillValue(challenge, node, '_3-pGM'),
    name: (challenge, node) => fillValue(challenge, node, '_3l-7L'),
    completeReverseTranslation:fillType,
    partialReverseTranslate: fillType2,
    speak: fillType,
    match: fillMatch3,
    listenMatch: fillMatch2,
}

gs_warn.style.display = 'block';
let session = {};
let activeChallenge = {};
let lineIndex = 0;
let dbKey = {};
let errorChallenges = [];
let challengeIndex = -1;
let hardChallengeIndex = -1;
let sessionCallback = null

function setSession(body){
    session = body;
    gs_warn.style.display = 'none';
    game_solver.style.display = 'block';
    if (sessionCallback){
        sessionCallback();
    }
    sessionCallback = null
}

chrome.runtime.onMessage.addListener(
    function(body, sender, sendResponse) {
        if ('currentCourse' in body){
            const course = body.currentCourse;
            if(!course.activePathSectionId){
                return
            }
            const sectionIndex = course.activePathSectionId.split('-')[1];
            const section = course.pathSectioned[sectionIndex];
            const unit = section.units[section.completedUnits];
            const levels = unit.levels;
            for(let i=0;i<levels.length;i++){
                const level = levels[i];
                if (level.state == 'active'){
                    dbKey = {
                        currentStoryMode: "READ",
                        includeSmartTips: false, //PENDIENTE
                        isExplanationSeen: false,
                        pathLevelFinishedSessions: level.finishedSessions,
                        pathLevelId: level.id,
                        pathLevelState: "active"
                    }
                    if(level.type != 'story'){
                        delete(dbKey.currentStoryMode)
                    }
                    break;
                }
            }
        } else if (('elements' in body || 'challenges' in body) && ['less', 'prac', 'stor'].includes(location.pathname.substring(1, 5))){
            setSession(body);
        }
    });

class AutoFillManager{
    constructor(){
        this.fill = () => null;
        this.clean = () => null;
        this.continueButton = document.body;
    }
    setUp(){
        this.continueButton = document.getElementsByClassName('_1rcV8 _1VYyp _1ursp _7jW2t')[0];
    }
    async autofill(){
        while(document.getElementsByClassName('_1rzr8 XBMXy').length > 0 && !this.continueButton.classList.contains('_2wryV')){
            this.continueButton.click()
            await new Promise(r => setTimeout(r, 128));
        }
        if(this.clean){
            this.clean();
            await new Promise(r => setTimeout(r, 256));
        }
        this.fill();
        this.continueButton.click();
        if(autofill_running){
            this.timeoutIds = [setTimeout(() => this.continueButton.click(), gs_input.value*500)];
        }
    }
}
const fillManager = new AutoFillManager()
addAutofillListener(fillManager);

function exitCallback(){
    session = {}
    sessionCallback = null;
    errorChallenges = [];
    challengeIndex = -1;
    hardChallengeIndex = -1;
}

function readDb(query){
    const parts = query.split('?mode=')
    if(parts.length > 1){
        dbKey.currentStoryMode = parts[1];
    }
    const dbRequest = indexedDB.open("duolingo", 9);
    dbRequest.onsuccess = () =>{
        db = dbRequest.result;
        let request = (db
            .transaction('prefetchedSessions')
            .objectStore('prefetchedSessions')
            .get(JSON.stringify(dbKey)));
        request.onsuccess = () => {
            if(request.result?.session){
                setSession(request.result?.session);
                db.close();
            } else {
                dbKey.includeSmartTips = true;
                request = (db
                    .transaction('prefetchedSessions')
                    .objectStore('prefetchedSessions')
                    .get(JSON.stringify(dbKey)));
                request.onsuccess = () => {
                    setSession(request.result?.session);
                    db.close();
                }
            }
            
        }
    }
}

function initStory(node0, callInit=true){
    if(callInit && location.pathname == '/lesson'){
        readDb(location.search)
    }
    if(!session.elements){
        sessionCallback = () => initStory(node0, false)
        return
    }
    const exercises = session.elements.filter(el => el.type in answers);
    Array.from(node0.getElementsByClassName('_9lM5k')).forEach((node1, ix)=>{
        const element = exercises[ix];
        const type = element.type;
        (new MutationObserver(records => {
            if(records.at(-1).addedNodes.length > 0 && type in answers){
                gs_move.innerHTML = answers[type](element, node1);
                fillManager.clean = () => null;
                fillManager.fill = fills[type](element, node1);
            } else{
                gs_move.innerHTML = '';
                fillManager.fill = () => {};
            }
        })).observe(node1, {childList: true});
    });
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
            hardChallengeIndex++
            activeChallenge = session.adaptiveChallenges[hardChallengeIndex];
        } else if(challengeIndex >= session.challenges.length - 1){
            activeChallenge = errorChallenges.shift();
        }
    } 
    if (!activeChallenge){
        challengeIndex++;
        activeChallenge = session.challenges[challengeIndex];
    }
    const type = node0.getAttribute('data-test').split('-').at(-1);
    if(type != activeChallenge.type && 'adaptiveInterleavedChallenges' in session){
        const obj = session.adaptiveInterleavedChallenges;
        const index = obj.speakOrListenReplacementIndices[challengeIndex];
        activeChallenge = obj.challenges[index];
    }
    if(!(type in answers)){
        gs_suspend();
        return
    }
    gs_move.innerHTML = answers[type](activeChallenge, node0);
    fillManager.clean = cleans[type];
    fillManager.fill = fills[type](activeChallenge, node0);
}

function initLesson(node0){
    challengeIndex = -1;
    initChallenge(document.getElementsByClassName('_1Mopf')[0])
    addComponentsTriggers(node0, ['_1Mopf'], initChallenge, undefined, undefined, undefined, 'lesson1');
    const footer = document.getElementById('session/PlayerFooter')
    new MutationObserver(records=>{
        if(footer.classList.contains('_2cfV0')){
            errorChallenges.push(activeChallenge);
        }
    }).observe(footer, {attributeFilter: ['class']})
}

function addDbEvents(node0){
    const observer = new MutationObserver(records =>{
        for(const node1 of node0.getElementsByClassName('_1rcV8 _1VYyp _1ursp _7jW2t PbV1v _2sYfM _19ped')){
            if(node1.getAttribute('href')?.at(7) == '/'){
                continue
            }
            node1.addEventListener('click', ev => readDb(ev.target.href), {passive: true});
        }
    })
    for(const node1 of node0.getElementsByClassName('R7x3_ _8Iu6E')){
        observer.observe(node1, {'childList': true});
    }
}
const root = document.getElementById('root');
let upcomingClasses = ['_2kkzG', '_3eVxP _2ocdD', '_3QKn2', '_2neC7']
addComponentsTriggers(root, upcomingClasses, initStory, 2, undefined, exitCallback, 'story');
addComponentsTriggers(root, ['_2kkzG', '_3GuWo _1cTBC',], initLesson, 2, undefined, exitCallback, 'lesson0');
addComponentsTriggers(root, ['_2kkzG', 'wl71D', '_41Y_n _2CoFd _2SLKP'], addDbEvents)
gs_retry.style.display='none';
