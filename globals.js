const gs_ordinals = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
let game_solver_started = false;
const game_solver = document.createElement('div');
game_solver.id = 'game-solver';
const gs_label = document.createElement('label');
gs_label.innerHTML = (chrome.i18n?.getMessage("answer") || "Answer") + ':';
game_solver.appendChild(gs_label);
const gs_answer = document.createElement('span');
gs_answer.id = 'gs-move';
game_solver.appendChild(gs_answer);
const gs_retry = document.createElement('button');
gs_retry.innerHTML = chrome.i18n?.getMessage("retry")  || "Retry";;
gs_retry.id = 'gs-retry';
game_solver.appendChild(gs_retry);
const gs_input = document.createElement('input');
gs_input.type = 'number'; 
gs_input.id = 'gs-timespan';
gs_input.name= 'timespan';
gs_input.value = 1;
gs_input.min = 0.01;
gs_input.step = 'any';
game_solver.appendChild(gs_input);
const gs_warn = document.createElement('div');
gs_warn.id = 'gs-warn';

const span = document.createElement('span');
span.innerHTML = chrome.i18n?.getMessage("seconds") || "Seconds";
game_solver.appendChild(span);
const gs_autofill = document.createElement('button');
const autofillStr = (chrome.i18n?.getMessage("autofill") || "Autofill") + ' (Ctrl+Shift+Enter)';
const suspendStr = (chrome.i18n?.getMessage("suspend") || "Suspend") + ' (Ctrl+Shift+Enter)';
gs_autofill.innerHTML = autofillStr;
gs_autofill.id = 'gs-autofill';
game_solver.appendChild(gs_autofill);
const gs_fill1 = document.createElement('button');
gs_fill1.innerHTML = (chrome.i18n?.getMessage("fill1") || "Fill 1") + ' (Ctrl+Enter)';
gs_fill1.id = 'gs-fill1';
game_solver.appendChild(gs_fill1);
const gs_hide = document.createElement('button');
gs_hide.innerHTML = (chrome.i18n?.getMessage("hide") || "Hide") + ' (Ctrl+I)';
const hideAction = ev => {
    if(game_solver.style.display == 'block'){
        game_solver.style.display = 'none';
    } else if(game_solver_started){
        game_solver.style.display = 'block';
    }
}
gs_hide.addEventListener('click', hideAction, {passive: true});
game_solver.appendChild(gs_hide);
const gs_discord = document.createElement('a');
gs_discord.innerHTML = 'Discord';
gs_discord.href = "https://discord.gg/qT7vTaWS6m";
gs_discord.target = '_blank';
game_solver.appendChild(gs_discord);

let gsResizing = false, gsMoving = false, gsX0, gsY0, gsResizeLoc = 1;
let moveTimeoutId;
const dragMove = ev => {
    clearTimeout(moveTimeoutId);
    moveTimeoutId = setTimeout(() => {
        const {x, y, top, bottom, left, right, width} = game_solver.getBoundingClientRect();
        const diffX = ev.clientX - gsX0;
        gsX0 = ev.clientX;
        if(gsResizing){
            game_solver.style.width = Math.min(Math.max(width + diffX * gsResizeLoc, 256), window.innerWidth) + 'px';
        }
        else if (gsMoving){
            const diffY = ev.clientY - gsY0;
            gsY0 = ev.clientY;
            const newTop = Math.max(0, top + diffY);
            const newBottom = Math.max(0, window.innerHeight - bottom - diffY);
            const newLeft = Math.max(0, left + diffX);
            const newRight = Math.max(0, window.innerWidth - right - diffX);
            if(newTop < newBottom){
                game_solver.style.top = newTop + 'px';
                game_solver.style.bottom = null;
            } else {
                game_solver.style.top = null;
                game_solver.style.bottom = newBottom + 'px';
            }
            if(newLeft < newRight){
                game_solver.style.left = newLeft + 'px';
                game_solver.style.right = null;
                gs_resize.style.left = null;
                gs_resize.style.right = '-10px';
                gsResizeLoc = 1
            } else {
                game_solver.style.left = null;
                game_solver.style.right = newRight + 'px';
                gs_resize.style.left = '-10px';
                gs_resize.style.right = null;
                gsResizeLoc = -1
            }
        }
    }, 64);
}
const dragEnd = ev => {
    document.removeEventListener('pointermove', dragMove);
    document.removeEventListener('pointerup', dragEnd);
    document.removeEventListener('pointerleave', dragEnd);
    gsResizing = gsMoving = false;
}
const dragStart = ev => {
    gsX0 = ev.clientX;
    document.addEventListener('pointermove', dragMove, {passive: true});
    document.addEventListener('pointerup', dragEnd, {passive: true});
    document.addEventListener('pointerleave', dragEnd, {passive: true});
}

const gs_move = document.createElement('button');
gs_move.innerHTML = '✥';
gs_move.addEventListener('pointerdown', ev => {
    gsMoving = true;
    gsY0 = ev.clientY;
    dragStart(ev);
}, {passive: true});
game_solver.appendChild(gs_move);
const gs_resize = document.createElement('button');
gs_resize.innerHTML = '↔';
gs_resize.id='gs-resize';
gs_resize.addEventListener('pointerdown', ev => {
    gsResizing = true;
    dragStart(ev);
    }, {passive: true})
game_solver.appendChild(gs_resize);
document.body.insertBefore(game_solver, document.body.firstChild);

const gs_warn_message = document.createElement('span');
gs_warn_message.id = "gs-warn-message";
gs_warn_message.innerHTML = chrome.i18n?.getMessage("warning") || "Open dev tools to see answers (Ctrl+Shit+I)<br/> If the challenge has started, reload the page (Ctrl + R)";
gs_warn.appendChild(gs_warn_message);
const gs_hide2 = gs_hide.cloneNode(true);
gs_hide2.innerHTML = gs_hide2.innerHTML.replace('(Ctrl+I)', '')
gs_hide2.addEventListener('click', ev => {
    gs_warn.style.display = 'none';
}, {passive: true});
gs_warn.appendChild(gs_hide2);
game_solver.insertAdjacentElement('afterend', gs_warn);

let autofill_running = false;
let intervalId = null;
let manager = null;

function gs_suspend(){
    autofill_running = false;
    gs_autofill.innerHTML = autofillStr;
    clearInterval(intervalId);
    if(manager?.timeoutIds){
        manager.timeoutIds.forEach(id => clearTimeout(id));
    }
}

function addAutofillListener(manager){
    const fillAll = ev => {
        autofill_running = true;
        gs_autofill.innerHTML = suspendStr;
        if(manager.setUp){
            manager.setUp()
        }
        intervalId = setInterval(()=>{
            manager.autofill()
            }, gs_input.value*1000);
    }
    gs_autofill.addEventListener('click', ev => {
        if(autofill_running){
            gs_suspend();
        } else {
            fillAll(ev);
        }
    }, {passive: true});
    const fill1 = ev => {
        if(manager.setUp){
            manager.setUp()
        }
        manager.autofill()
    }
    gs_fill1.addEventListener('click', fill1, {passive: true});
    document.addEventListener('keyup', ev =>{
        if(ev.ctrlKey && ev.shiftKey && ev.key.toLowerCase() == 'enter'){
            if (autofill_running){
                gs_suspend();
            } else {
                fillAll(ev);
            }
        } else if(ev.ctrlKey && !ev.shiftKey && ev.key.toLowerCase() == 'enter' ){
            fill1(ev);
        } else if(ev.ctrlKey && !ev.shiftKey && ev.key.toLowerCase() == 'i') {
            hideAction(ev)
        }
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
            game_solver_started = false
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

function gsInit(){
    gs_warn.style.display = 'none';
    game_solver.style.display = 'block';
    game_solver_started = true;
}
