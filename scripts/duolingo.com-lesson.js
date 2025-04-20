(() =>{

    const ordinals = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
    let superChallenge

    function getInputAnswer(challenge, node0, end=1){
        const nodes1 = Array.from(node0.getElementsByClassName('_3mwuq'))
        if (nodes1.length > 0){
            return nodes1.map(input => {
                let answer = input.parentElement.firstChild.innerHTML
                return answer.substring(1, answer.length - end)
            }).join('; ');
        } else {
            return challenge.challengeResponseTrackingProperties.best_solution;
        }
    }
    function getInputAnswer2(challenge, node0){
        return node0.getElementsByClassName('_2pNyl _32bZV Id-Wa')[0].innerHTML;
    }
    function getMatchAnswer2(challenge, node0){
        const nodes = [...node0.getElementsByClassName('_3fmUm')]
        const dict = {}
        const length = Math.round(nodes.length / 2);
        nodes.slice(length).forEach(node1 => {
            dict[node1.getAttribute('data-test')] = node1.getElementsByClassName('_231NG')[0].firstChild.innerHTML;
        });
        return (nodes
            .slice(0, length)
            .map((node1, index) => `${ordinals[index]}: ${dict[node1.getAttribute('data-test')]}`)
            .join('; '));
    }
    function getMatchAnswer3(challenge, node0){
        const nodes = [...node0.getElementsByClassName('_3fmUm')]
        const dict = Object.fromEntries(challenge.pairs.map(pair => [pair.fromToken, pair.learningToken]));
        return (nodes
            .slice(0, Math.round(nodes.length / 2))
            .map(node1 => {
                const token = node1.getElementsByClassName('_231NG')[0].firstChild.innerHTML;
                return `${token}: ${dict[token]}`;
            })
            .join('; '));
    }
    function getTapCompleteTable(challenge, node0){
        const answers = [];
        const columns = challenge.displayTableTokens[0].length;
        displayTableTokens.forEach(token => {
            for(let i=0; i < columns; i++){
                if (token[i].isBlank){
                    answers.push(
                        token.slice(0, i).map(subtoken => subtoken.text).join(' ')
                        + ' ... '
                        + token.slice(i + 1).map(subtoken => subtoken.text).join(' ')
                        + ': '
                        + token[i].text);
                }
            }
        });
        return answers.join('\n');
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
        const nodes = [...node0.getElementsByClassName('_3fmUm')];
        const length = Math.round(nodes.length / 2);
        const dict0 = {};
        const dict1 = {};
        fillDict(nodes.slice(0, length), dict0);
        fillDict(nodes.slice(length), dict1);
        challenge.pairs.forEach(pair => {
            if(dict0[pair.fromToken] && dict1[pair.learningToken]){
                dict0[pair.fromToken].click();
                dict1[pair.learningToken].click();
            }
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
        const container = node0.getElementsByClassName('eSgkc')[0]
        if (container){
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
            fillValue(challenge, node0);
        }
    }
    function fillType(challenge, node0, end=1){
        const nodes1 = Array.from(node0.getElementsByClassName('_3mwuq'))
        if (nodes1.length > 0){
            nodes1.forEach(input => {
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
        } else {
            fillValue(challenge, node0);
        }
    }
    function fillType2(challenge, node0, className){
        const editable = node0.getElementsByClassName('_1W1IX')[0];
        editable.innerHTML = document.getElementsByClassName('Id-Wa')[0].innerHTML;
        editable.dispatchEvent(new Event('input', {bubbles: true}));
    }
    function fillValue(challenge, node0){
        const input = node0.getElementsByClassName('_3zGeZ _394fY RpiVp')[0]
        input.value = challenge.correctSolutions?.at(0) || challenge.challengeResponseTrackingProperties?.best_solution || challenge.prompt;
        let event = new Event('input', {bubbles: true});
        event.simulated = true;
        if(input._valueTracker){
            input._valueTracker.setValue('');    
        }
        input.dispatchEvent(event);
    }
    function fillTapCompleteTable(challenge, node0){
        const dict = {};
        document.getElementsByClassName('_DVHp').forEach(node1 => {
            const node2 = node1.firstChild.firstChild;
            dict[node2.textContent] = node2;
        })
        const columns = displayTableTokens[0].length;
        displayTableTokens.forEach(token => {
            for(let i=0; i < columns; i++){
                if (token[i].isBlank){
                    dict[token[i].text].click();
                }
            }
        });
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
        tapCompleteTable: getTapCompleteTable,
        tapCloze: challenge => challenge.correctIndices.map(index => challenge.choices[index]).join('; '),
        typeCloze: (challenge, node) => getInputAnswer(challenge, node, 0),
        typeClozeTable: (challenge, node) => getInputAnswer(challenge, node, 0),
        typeCompleteTable: (challenge, node) => getInputAnswer(challenge, node, 0),
        translate: challenge => challenge.correctSolutions[0],
        listenComplete: getInputAnswer,
        listen: challenge => challenge.prompt,
        name: challenge=> challenge.correctSolutions[0],
        completeReverseTranslation: getInputAnswer,
        partialReverseTranslate: getInputAnswer2,
        match: getMatchAnswer3,
        extendedMatch: getMatchAnswer3,
        listenMatch: getMatchAnswer2,
        extendedListenMatch: getMatchAnswer2,
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
        tapCompleteTable: () => clickChildren('_8g3cL', 3),
        tapCloze: () => Array.from(document.getElementsByClassName('_3Fpm6')).forEach(node => node.click()),
        typeCloze: null,
        typeClozeTable: null,
        typeCompleteTable: null,
        translate: () => clickChildren('_2-F7v', 2),
        listenComplete: null,
        listen: null,
        name: null,
        completeReverseTranslation: null,
        partialReverseTranslate: null,
        match: null,
        extendedMatch: null,
        listenMatch: null,
        extendedListenMatch: null,
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
        tapCompleteTable: fillTapCompleteTable,
        tapCloze: fillCorrectIndices,
        typeCloze: (challenge, node) => fillType(challenge, node, 0),
        typeClozeTable: (challenge, node) => fillType(challenge, node, 0),
        typeCompleteTable: (challenge, node) => fillType(challenge, node, 0),
        translate: fillCorrectTokens,
        listenComplete: fillType,
        listen: fillValue,
        name: fillValue,
        completeReverseTranslation:fillType,
        partialReverseTranslate: fillType2,
        match: fillMatch3,
        extendedMatch: fillMatch3,
        listenMatch: fillMatch2,
        extendedListenMatch: fillMatch2,
        selectPronunciation: fillCorrectIndex,
        sameDifferent: fillCorrectIndex,
    }

    function initChallenge(node0){
        gsInit()
        clearInterval(challengeIntervalId);
        challengeIntervalId = undefined;
        const headerNode = document.getElementsByClassName('_3EOK0')[0]
        const activeChallenge = Object.values(headerNode)[0]?.memoizedProps.children.props.challenge;
        const type = node0.getAttribute('data-test').split('-').at(-1);
        if(!(type in lessonAnswers)){
            gs_answer.innerHTML = '';
            fillManager.fill = () => {};
            gs_suspend();
            return
        }
        /*if (['extendedListenMatch', 'extendedMatch'].includes(type)){
            if (!superChallenge){
                superChallenge = {pairs: []};
                session.challenges.forEach(challenge => {
                    if(challenge.pairs){
                        superChallenge.pairs.push(...challenge.pairs);
                    }
                })
            }
            activeChallenge = superChallenge;
        }*/
        gs_answer.innerHTML = lessonAnswers[type](activeChallenge, node0);
        fillManager.clean = lessonCleans[type];
        fillManager.fill = async () => {
            await lessonFills[type](activeChallenge, node0);
            fillManager.continueButton.click();
        }
        if (['extendedListenMatch', 'extendedMatch'].includes(type)){
            challengeIntervalId = setInterval(()=>{
                gs_answer.innerHTML = lessonAnswers[type](activeChallenge, node0);
                }, 5000);
        }
    }

    function initLesson(node0){
        superChallenge = undefined;
        addComponentsTriggers(node0, ['_1Mopf'], initChallenge);
    }
    addComponentsTriggers(root, ['_2kkzG', '_29gfw', '_3GuWo _1cTBC',], initLesson, 2, undefined, exitCallback);
})()
