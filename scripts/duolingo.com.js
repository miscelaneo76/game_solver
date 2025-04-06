gs_warn.style.display = 'block';
let session = {};
let dbKey = {};
let errorChallenges = [];
let challengeIndex = -1;
let hardChallengeIndex = -1;
let sessionCallback = null
let challengeIntervalId; 

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
        if (('elements' in body || 'challenges' in body) && ['less', 'prac', 'stor', 'alph', 'mist'].includes(location.pathname.substring(1, 5))){
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
            this.continueButton.click();
            await wait(128);
        }
        if(this.clean){
            this.clean();
            await wait(256);
        }
        await this.fill();
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
    clearInterval(challengeIntervalId);
    challengeIntervalId = undefined;
}

async function readDb(query){
    const parts = query.split('?mode=')
    const rawDuoState = JSON.parse(localStorage.getItem('duo.state'))
    const bytes = Uint8Array.from(Array.from(atob(rawDuoState)).map(c => c.charCodeAt()));
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))
    let duoState = await new Response(stream).json();
    duoState = duoState.state.redux
    const user = duoState.user;
    const courseId = user.currentCourseId;
    const course = duoState.courses[courseId];
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
            const now = new Date().getTime() / 1e3;
            const generatorIdsOfRecentMistakes = (
                duoState.courseHistories[courseId].mistakeHistory
                .filter(mistake => mistake.additionalData.levelId == level.id && mistake.expirationTimestamp > now)
                .map(mistake => mistake.value.generatorIdentifier.generatorId));
            dbKey = {
                currentStoryMode: parts[1] || "READ",
                generatorIdsOfRecentMistakes: generatorIdsOfRecentMistakes,
                includeSmartTips: innerWidth >= 700,
                isExplanationSeen:level.pathLevelMetadata.skillId in user.explanationsSeen,
                pathLevelFinishedSessions: level.finishedSessions,
                pathLevelId: level.id,
                pathLevelState: "active"
            }
            if(level.type != 'story'){
                delete(dbKey.currentStoryMode)
            } else {
                dbKey.includeSmartTips = false;
            }
            if(!(level.hasLevelReview && level.finishedSessions == level.totalSessions - 1)){
                delete(dbKey.generatorIdsOfRecentMistakes)
            }
            break;
        }
    }
    const dbRequest = indexedDB.open("duolingo", 9);
    dbRequest.onsuccess = () =>{
        db = dbRequest.result;
        let request = (db
            .transaction('prefetchedSessions')
            .objectStore('prefetchedSessions')
            .get(JSON.stringify(dbKey)));
        request.onsuccess = () => {
            setSession(request.result?.session);
            db.close();
        }
    }
}

const observer = new MutationObserver(records =>{
    for(const node1 of document.getElementsByClassName('_1rcV8 _1VYyp _1ursp _7jW2t PbV1v _2sYfM _19ped')){
        if(node1.getAttribute('href')?.at(7) == '/'){
            continue
        }
        node1.addEventListener('click', ev => readDb(ev.target.href), {passive: true});
    }
})

function addDbEvents(node0){
    for(const node1 of node0.getElementsByClassName('R7x3_ _8Iu6E')){
        observer.observe(node1, {'childList': true});
    }
}
const root = document.getElementById('root');
addComponentsTriggers(root, ['_2kkzG', 'AkzqY', 'wl71D', '_41Y_n _2CoFd _2SLKP'], addDbEvents)
addComponentsTriggers(root, ['_2kkzG', 'wl71D', '_41Y_n _2CoFd _2SLKP'], addDbEvents)
gs_retry.style.display='none';
