(() => {
    const text_input = document.getElementById('text-input');
    const game_play_view = document.getElementById('game-play-view');
    const play_video_warn = document.getElementById('play-video-warn')
    let timeoutId = null;

    function listener(ev){
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            gs_answer.innerHTML= lt.game.page.playView.cursor?.text;
        }, 512);
    }

    function init(records, observer){
        const target = records[0].target;
        if(game_play_view.style.display == 'block' && !play_video_warn.classList.contains('show')){        
            gs_answer.innerHTML= lt.game.page.playView.cursor?.text;
            game_solver.style.display = 'block';
            if(lt.game.page.exercise?.input == 'write'){
                text_input.addEventListener('keypress', listener, {passive: true});
            } else if(lt.game.page.exercise?.input == 'choice'){
                for(let i=0; i<4; i++){
                    lt.game.page.playView.slotsView.$slots[i].addEventListener('tapend', listener, {passive: true});
                }
            }
        } else{
            game_solver.style.display = 'none';
            text_input.removeEventListener('keypress', listener);
            for(let i=0; i<4; i++){
                lt.game.page.playView.slotsView.$slots[i].removeEventListener('tapend', listener);
            }
        }
    }

    const observer = new MutationObserver(init);
    observer.observe(game_play_view, { attributeFilter: ['style'] });
    observer.observe(play_video_warn, { attributeFilter: ['class'] });

    class AutoFillManager{
        
        constructor(){
            this.autofillWay = () => {};
            this.choices = [];
            this.indexes = [];    
        }

        setUp(){
            if(lt.game.page.exercise?.input == 'write'){
                this.autofillWay = this.autofillWrite;
                
            } else if(lt.game.page.exercise?.input == 'choice'){
                this.choices = [];
                for(let i=0; i < 4; i++){
                    this.choices.push(lt.game.page.playView.slotsView.$slots[i].textContent.toLowerCase())
                }
                this.autofillWay = this.autofillChoice;
            }
        }
        autofillWrite(text){
            for(let i=lt.game.page.playView.cursor?.cpos; i < text.length ;i++){
                const code = text[i].charCodeAt();
                text_input.dispatchEvent(new KeyboardEvent('keypress', {
                    key: text[i], keyCode: code, which: code
                }));
            }
        }
        autofillChoice(text){
            this.indexes.forEach(index =>{
                this.choices[index] = lt.game.page.playView.slotsView.$slots[index].textContent.toLowerCase();
            });
            this.indexes = [];
            if(!this.choices.includes(text.toLowerCase())){
                gs_suspend();
                return
            }
            this.choices.forEach((_text, index) => {
                if (_text == text.toLowerCase()){
                    this.indexes.push(index);
                    lt.game.page.playView.slotsView.$slots[index].dispatchEvent(new Event('tapstart'));
                    lt.game.page.playView.slotsView.$slots[index].dispatchEvent(new Event('tapend'));    
                }
            })
        }
        autofill(){
            const text = lt.game.page.playView.cursor?.text;
            if(!text){
                gs_suspend();
                return
            }
            this.autofillWay(text);
        }
    }

    addAutofillListener(new AutoFillManager());
    gs_retry.addEventListener('click', listener, {passive: true});
})()
