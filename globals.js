const game_solver = document.createElement('div');
game_solver.id = 'game-solver';
const label = document.createElement('label');
label.innerHTML = 'Answer:';
game_solver.appendChild(label);
const gs_move = document.createElement('span');
gs_move.id = 'gs-move';
game_solver.appendChild(gs_move);
const gs_retry = document.createElement('button');
gs_retry.innerHTML = 'Retry';
gs_retry.id = 'gs-retry';
game_solver.appendChild(gs_retry);
const gs_input = document.createElement('input');
gs_input.type = 'number'; 
gs_input.id = 'gs-timespan';
gs_input.name= 'timespan';
gs_input.value = 1;
gs_input.min = 0.01;
game_solver.appendChild(gs_input);
const gs_warn = document.createElement('div');
gs_warn.id = 'gs-warn';

const span = document.createElement('span');
span.innerHTML = 'seconds';
game_solver.appendChild(span);
const gs_autofill = document.createElement('button');
gs_autofill.innerHTML = 'Autofill';
gs_autofill.id = 'gs-autofill';
game_solver.appendChild(gs_autofill);
const gs_fill1 = document.createElement('button');
gs_fill1.innerHTML = 'Fill 1';
gs_fill1.id = 'gs-fill1';
game_solver.appendChild(gs_fill1);
const gs_hide = document.createElement('button');
gs_hide.innerHTML = 'Hide';
const hideAction = ev => {
    game_solver.style.display = 'none';
    gs_warn.style.display = 'none';
}
gs_hide.addEventListener('click', hideAction, {passive: true});

game_solver.appendChild(gs_hide);
document.body.insertBefore(game_solver, document.body.firstChild);
const gs_warn_message = document.createElement('span');
gs_warn_message.id = "gs-warn-message";
gs_warn_message.innerHTML = "Open dev tools to see answers (Ctrl + Shit + I)<br/> If the challenge has started, reload the page (Ctrl + R)";
gs_warn.appendChild(gs_warn_message);
const gs_hide2 = gs_hide.cloneNode(true);
gs_hide2.addEventListener('click', hideAction, {passive: true});
gs_warn.appendChild(gs_hide2);
game_solver.insertAdjacentElement('afterend', gs_warn);

let autofill_running = false;
let intervalId = null;
let manager = null;

function gs_suspend(){
    autofill_running = false;
    gs_autofill.innerHTML = "Autofill";
    clearInterval(intervalId);
    if(manager?.timeoutIds){
        manager.timeoutIds.forEach(id => clearTimeout(id));
    }
}

function addAutofillListener(manager){
    gs_autofill.addEventListener('click', ev => {
        if(autofill_running){
            gs_suspend();
            return
        }
        autofill_running = true;
        gs_autofill.innerHTML = "Suspend";
        if(manager.setUp){
            manager.setUp()
        }
        intervalId = setInterval(()=>{
            manager.autofill()
            }, gs_input.value*1000);
    }, {passive: true});
    gs_fill1.addEventListener('click', ev => {
        if(manager.setUp){
            manager.setUp()
        }
        manager.autofill()
    }, {passive: true});
}

function addComponentsTriggers(root, upcomingClasses, callback, exitLevel, notExpectedChildClass, exitCallback) {
    let level0 = 0;
    const nodes = upcomingClasses.map(cl => undefined);
    const monitor = (records, observer) => {
        let level1 = upcomingClasses.length;
        for(let i=0;i < upcomingClasses.length;i++){
            const node = document.getElementsByClassName(upcomingClasses[i])[0];
            if(!node){
                level1 = i;
                break
            }
            if(node != nodes[i]){
                if(i < nodes.length -1){
                    nodes[i] = node;
                    observer.observe(node, {childList: true});
                } else {
                    if(!notExpectedChildClass || ![...node?.firstChild.classList].includes(notExpectedChildClass)){
                        nodes[i] = node;
                        callback(node)
                    } else {
                        observer.observe(node, {childList: true});
                    }
                }
            }
        }
        if(exitLevel != undefined && level1 < exitLevel && level0 >= exitLevel){
            gs_move.innerHTML = '';
            game_solver.style.display = 'none';
            if(autofill_running){
                gs_suspend();
            }
            if(exitCallback){
                exitCallback()
            }
        }
        level0 = level1;
    }
    const observer = new MutationObserver(monitor)
    observer.observe(root, {childList: true});
    monitor([], observer);
}

const wait = time => new Promise(resolve => setTimeout(resolve, time));
