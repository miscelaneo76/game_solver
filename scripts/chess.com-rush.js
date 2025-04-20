inputManager.type='rush';
const challenge = JSON.parse(localStorage.json_settings).rushChallenges?.at(0);
if(challenge){
    inputManager.index = challenge.puzzleIndex || 0;
    inputManager.addPuzzles(challenge.puzzles || []);
}
gsInit();
