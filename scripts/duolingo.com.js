let challengeIntervalId; 

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
    clearInterval(challengeIntervalId);
    challengeIntervalId = undefined;
    game_solver.style.display = 'none';
}

function clickNode(className, node, index){
    node.getElementsByClassName(className)[index].click()
}

const observer = new MutationObserver(records =>{
    for(const node1 of document.getElementsByClassName('_1rcV8 _1VYyp _1ursp _7jW2t PbV1v _2sYfM _19ped')){
        if(node1.getAttribute('href')?.at(7) == '/'){
            continue
        }
        node1.addEventListener('click', ev => readDb(ev.target.href), {passive: true});
    }
})

const root = document.getElementById('root');
gs_retry.style.display='none';
gs_input.value = 2;
gs_input.min = 2;
