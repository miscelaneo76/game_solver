(() => {
    function getMatchAnswer(element, node){
        const dict = {};
        (element.matches || element.fallbackHints).forEach(match => {
            dict[match.translation] = match.phrase;
        })
        return ([...node.firstChild.lastChild.firstChild.firstChild.getElementsByClassName('_231NG')]
            .map(node1 => {
                const key = node1.firstChild.innerHTML
                return `${key}: ${dict[key]}`
            }).join("<br/>"));
    }
    function fillMatch(element, node){
        return () => {
            const dict = {};
            (element.matches || element.fallbackHints).forEach(match => {
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
    function fillArrange(element, node){
        return () => {
            const nodes = [...node.getElementsByClassName('_3fmUm')];
            const indexes = element.phraseOrder;
            const start = indexes.length - nodes.length;
            for(let i=start;i<indexes.length;i++){
                let index = indexes[i];
                index -= indexes.filter((ix,j) => j < start && ix < index).length;
                nodes[index].click();
            }
        }
    }

    const storyAnswers = {
        SELECT_PHRASE: element => element.answers[element.correctAnswerIndex],
        MULTIPLE_CHOICE: element => element.answers[element.correctAnswerIndex].text,
        POINT_TO_PHRASE: (element, node) => node.getElementsByClassName('_231NG')[element.correctAnswerIndex].firstChild.innerHTML,
        ARRANGE: element => element.phraseOrder.map(index => element.selectablePhrases[index]).join(' '),
        MATCH: getMatchAnswer,
        //TYPE_TEXT: () => null
    }
    const storyFills = {
        SELECT_PHRASE: (element, node) => () => clickNode('_1YnrO _2qc6a', node, element.correctAnswerIndex),
        MULTIPLE_CHOICE: (element, node) => () => clickNode('_1NTQa', node, element.correctAnswerIndex),
        POINT_TO_PHRASE: (element, node) => () => clickNode('_1R3Iz', node, element.correctAnswerIndex),
        ARRANGE: fillArrange,
        MATCH: fillMatch,
        //TYPE_TEXT: () => null,
    }

    function initStory(node0, callInit=true){
        gsInit();
        const headerNode = document.getElementsByClassName("_2neC7")[0];
        const exercises = Object.values(headerNode)[0]?.return.memoizedProps.storyElements.filter(el => el.type in storyAnswers);
        Array.from(node0.getElementsByClassName('_9lM5k')).forEach((node1, ix)=>{
            const element = exercises[ix];
            const type = element.type;
            (new MutationObserver(records => {
                if (records.at(-1).addedNodes.length > 0 && type in storyAnswers){
                    gs_answer.innerHTML = storyAnswers[type](element, node1);
                    fillManager.clean = () => null;
                    fillManager.fill = storyFills[type](element, node1);
                } else {
                    gs_answer.innerHTML = '';
                    fillManager.fill = () => {};
                }
            })).observe(node1, {childList: true});
        });
    }
    let upcomingClasses = ['_2kkzG', '_3eVxP _2ocdD', '_3QKn2', '_2neC7']
    addComponentsTriggers(root, upcomingClasses, initStory, 2, undefined, exitCallback);
})()
