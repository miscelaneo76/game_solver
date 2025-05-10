function evaluate(node0, data, resultType=XPathResult.FIRST_ORDERED_NODE_TYPE){
    return document.evaluate(
        `.//*[@data-qa-pass="${data}"]`,
        node0,
        null,
        resultType,
        null)
}

function getDragdropElements(layout){
    const n = layout.getElementsByClassName('fillgap-dragdrop__btn').length
    const _elements = [];
    for(let i=0; i<n; i++){
        _elements.push(evaluate(layout, i + 1).singleNodeValue);
    }
    return _elements
}

function getElements(layout){
    let _elements = [];
    let index = 0;
     while(node = evaluate(layout, index).singleNodeValue){
        _elements.push(node);
        index++;
    }
    return _elements
}

function getMatchupElements(layout){
    let _elements = [];
    let index = 0;
    while(true){
        const xpath = evaluate(layout, index, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
        const el0 = xpath.iterateNext();
        if (!el0){
            break
        }
        _elements.push([el0, xpath.iterateNext()]);
        index++;
    }
    return _elements
}
function getHighlightElements(layout){
    let _elements = [];
    const xpath = evaluate(layout, 'true', XPathResult.ORDERED_NODE_ITERATOR_TYPE);
    while(el0 = xpath.iterateNext()){
        _elements.push(el0);
    }
    return _elements
}


function getAnswers(elements, delimiter='; '){
    return elements.map(el=>{
        let response = el.firstChild.innerHTML;
        const xpath = document.evaluate(`.//*[text()="${response}"]`, el.parentElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE,null);
        let index = -1;
        let count = 0;
        while(el1 = xpath.iterateNext()){
            if(el1.parentElement == el){
                index = count;
            }
            count++;
            if (index>=0 && count>1){
                response += ` [${gs_ordinals[index]}]`;
                break
            }
        }
        return response;
    }).join(delimiter)
}
function removeElements(code){
    [...document.getElementsByClassName(`ex-btn--${code}`)].forEach(el => el.click());
}

function fillElements(elements){
    elements.forEach(el => el.click());
}

function fillTyping(elements){
    const submitButton = document.getElementsByClassName('ex-feedback-bar__button')[0];
    elements.forEach(input => {
        input.value = input.getAttribute('data-qa-pass');
        let event = new Event('input', {bubbles: true});
        event.simulated = true;
        if(input._valueTracker){
            input._valueTracker.setValue('');    
        }
        input.dispatchEvent(event);
    });
    submitButton.click();
}

const elements = {
    'ex-typing': layout => [...layout.getElementsByClassName('ex-typing__input')],
    'ex-true-false': layout => evaluate(layout, 'true').singleNodeValue,
    'ex-mcq': layout => evaluate(layout, 'true').singleNodeValue,
    'ex-highlighter': getHighlightElements,
    'ex-fillgap-dragdrop': getDragdropElements,
    'ex-phrase-builder': getElements,
    'ex-spelling': getElements,
    'ex-matchup': getMatchupElements,
    'ex-flashcard': layout => [],
    'ex-tip': layout => [],
    'ex-comprehension': layout => [],
    //'ex-conversation': '', // No because it's personal
    //'ex-dialogue':,
    //'ex-speech-rec':
}

const answers = {
    'ex-typing': elements => elements.map(input => input.getAttribute('data-qa-pass')).join('; '),
    'ex-true-false': element => element.lastChild.textContent,
    'ex-mcq': element => element.lastChild.innerHTML,
    'ex-highlighter': getAnswers,
    'ex-fillgap-dragdrop': getAnswers,
    'ex-phrase-builder': elements => getAnswers(elements, ' '),
    'ex-spelling': elements => getAnswers(elements, ''),
    'ex-matchup':elements => (elements
        .map(els=>els.map(el => el.firstChild.innerHTML).join(': '))
        .join('<br/>')),
    'ex-flashcard': elements => '',
    'ex-tip': elements => '',
    'ex-comprehension': elements => '',
    //'ex-dialogue':,
    //'ex-speech-rec':
}
const cleans = {
    'ex-typing': () => {},
    'ex-true-false': () => {},
    'ex-mcq': () => {},
    'ex-highlighter': () => removeElements('selected'),
    'ex-fillgap-dragdrop': () => removeElements('m'),
    'ex-phrase-builder': () => removeElements('space'),
    'ex-spelling': () => removeElements('s'),
    'ex-matchup': () => {},
    'ex-flashcard': () => {},
    'ex-tip': () => {},
    'ex-comprehension': () => {},
    //'ex-dialogue':,
    //'ex-speech-rec':
}
const fills = {
    'ex-typing': fillTyping,
    'ex-true-false': element => element.click(),
    'ex-mcq': element => element.click(),
    'ex-highlighter': elements => elements.forEach(el => el.click()),
    'ex-fillgap-dragdrop': fillElements,
    'ex-phrase-builder': fillElements,
    'ex-spelling': fillElements,
    'ex-matchup':elements => elements.forEach(els => els.forEach(el => el.click())),
    'ex-flashcard': elements => null,
    'ex-tip': elements => null,
    'ex-comprehension': elements => null,
    //'ex-dialogue':,
    //'ex-speech-rec':

}
function getExType(layout){
    return layout.getAttribute('data-qa-ex');
}

function nextMove(layout){
    const exType = getExType(layout);
    if(!(exType in elements)){
        gs_answer.innerHTML = '';
        return
    }
    gs_answer.innerHTML = answers[exType](elements[exType](layout));
}

class AutoFillManager{
    autofill(){
        const exType = getExType(this.layout);
        if(!(exType in elements)){
            gs_suspend();
            return
        }
        cleans[exType]();
        fills[exType](elements[exType](this.layout));
        const submitButton = document.getElementsByClassName('ex-feedback-bar__button')[0];
        if(!submitButton){
            gs_suspend();
            return
        }
        if(autofill_running){
            this.timeoutIds = [setTimeout(() => submitButton.click(), gs_input.value*500)];    
        }
    }
}
manager = new AutoFillManager();
addAutofillListener(manager);
let retryFunction = null;

function init(layout){
    manager.layout = layout;
    nextMove(layout)
    gsInit();
    gs_retry.removeEventListener('click', retryFunction);
    retryFunction = ev => nextMove(layout);
    gs_retry.addEventListener('click', retryFunction, {passive: true});
}

const upcomingClasses = [
    'viewport__content',
    'learning-layout',
    'learning-layout__content',
    'learning-layout__fade']
addComponentsTriggers(document.getElementById('react-root'), upcomingClasses, init, 4, 'loader');
