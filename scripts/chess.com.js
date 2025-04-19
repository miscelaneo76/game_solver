function divmod(x, y=8) {
    return [Math.floor(x/y), x % y];
}
function ix2ChessPosition(ix){
    const [y, x]= divmod(ix);
    return String.fromCharCode(x + 97) + String(y + 1);
}

const colors = ['w', 'b'];
const locationsMapper = Object.fromEntries(Array.from({length: 26}, (_, i) => [String.fromCharCode(i + 97), i]).concat(
    Array.from({length: 26}, (_, i) => [String.fromCharCode(i + 65), i + 26]),
    Array.from({length: 10}, (_, i) => [String(i), i + 52]),
    [...'!?{~}(^)[_]@#$'].map((v,i) => [v, i + 62])
    ));
promotions ='QNRB';
const spaces = [];
for(let i=1;i<=8;i++){
    spaces.push(Array.from({length:i}).fill(' ').join(''));
}

const board = document.getElementById('board-primary');
game_solver.style.bottom = '0px'; // To not block chessboard in most cases

class InputManager{

    constructor(){
        this.index = 0;
        this.moves = {};
        this.timeoutId = null;
    }
    addPuzzles(puzzles){
        puzzles = puzzles.slice(this.index);
        if(puzzles.length == 0){
            return
        }
        this.index += puzzles.length;
        puzzles.forEach(puzzle => {
            let fen = puzzle.initialFen.split(' ', 2);
            fen[1] = colors.indexOf(fen[1]);

            fen[0] = fen[0].split('/').reverse().join('').split('').map(c=>{
                const n = Number(c);
                if(!n){
                    return c;
                }
                return spaces[n - 1];
            }).join('').split('');
            const moves = (
                puzzle.firstMove
                + puzzle.moves?.map(move => move.move + move.counter).join('')
                || puzzle.tcnMoveList);
            for(let i=0; i<moves.length; i+=2){
                const ix0 = locationsMapper[moves[i]];
                let ix1 = locationsMapper[moves[i + 1]];
                let promotion = '';
                if (ix1 > 63){
                    promotion = promotions[Math.floor((ix1 - 64) / 3)]; 
                    ix1 = ix0 + (ix0 < 16 ? -8 : 8) + (ix1 - 1) % 3 - 1
                }
                const piece = fen[0][ix0].toUpperCase();
                if(i % 4){
                    let fen0 = [...fen[0]];
                    for(let i=8;i<64;i+=9){
                        fen0.splice(i, 0, '/');
                    }
                    fen0 = fen0.join('');
                    for(let i=8;i>0;i--){
                        fen0 = fen0.replaceAll(spaces[i - 1], i);
                    }
                    fen0 = fen0.split('/').reverse().join('/');
                    const color = colors[fen[1]];
                    this.moves[fen0 + ' ' + color] = {
                        piece: piece,
                        move:[ix0, ix1],
                        capture: fen[0][ix1] != ' ',
                        promotion: promotion,
                        color: color};
                }
                if (piece == 'K'){
                    if (ix0 - ix1 == 2){
                        // Long castling
                        fen[0][ix0 - 1] = fen[0][ix0 - 4];
                        fen[0][ix0 - 4] = ' ';
                    } else if (ix1 - ix0 == 2){
                        // Shore castling
                        fen[0][ix0 + 1] = fen[0][ix0 + 3];
                        fen[0][ix0 + 3] = ' ';
                    }
                } else if (piece == 'P' && [-9, -7, 7, 9].includes(ix1 - ix0) && fen[0][ix1] == ' '){
                    // En passant
                    fen[0][ix0 + Math.abs(ix1- ix0) - 8] = ' ';
                }
                if(promotion){
                    if(fen[1]){
                        promotion = promotion.toLowerCase();
                    }
                    fen[0][ix1] = promotion;
                } else {
                    fen[0][ix1] = fen[0][ix0];    
                }
                fen[0][ix0] = ' ';
                fen[1] = 1 - fen[1];
            }
        });
    }

    nextMove(){
        const pieces = Object.fromEntries([...board.getElementsByClassName('piece')].map(el => {
            const classes = [...el.classList];
            return [
                classes.find(cl => /square-\d\d/.test(cl)).substring(7,9),
                classes.find(cl => /[bw][pkqrnb]/.test(cl))
            ];
        }))
        let fen = '';
        for(let i=8;i>0;i--){
            let line = '';
            let count = 0;
            for(let j=1;j<=8;j++){
                const piece = pieces[String(j)+String(i)];
                if(piece){
                    if(count){
                        line += count;
                        count = 0;
                    }
                    let figure = piece[1];
                    if(piece[0]=='w'){
                        figure = figure.toUpperCase();
                    }
                    line += figure;
                } else{
                    count++;
                }
            }
            if(count){
                line += count;
                count = 0;
            }
            fen += line + '/';
        }
        fen = fen.slice(0,-1)
        if([...board.classList].includes('flipped')){
            fen.split('').reverse().join('');
        }
        fen = fen + ' ' + (document.getElementsByClassName('sidebar-status-square-black').length ? 'b' : 'w');
        if(!(fen in this.moves) && this.type == 'rush'){
            const challenge = JSON.parse(localStorage.json_settings).rushChallenges[0];
            this.addPuzzles(challenge.puzzles);
        }
        return this.moves[fen] || {};
    }

    setMove(){
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            let {move, piece, capture, promotion} = this.nextMove();
            if(!move){
                gs_answer.innerHTML = '';
                return null;
            }
            const [ix0, ix1] = move;
            let moveStr = null;
            if (piece == 'K'){
                if (ix0 - ix1 == 2){
                    moveStr = 'O-O-O';
                } else if (ix1 - ix0 == 2){
                    moveStr = 'O-O';
                }
            }
            if (!moveStr){
                if(piece == 'P'){
                    piece='';
                }
                moveStr = piece + ix2ChessPosition(ix0) + (capture ?'x':'') + ix2ChessPosition(ix1) + promotion;
            }
            gs_answer.innerHTML = moveStr;
        }, 512);
    }
}

const inputManager = new InputManager();
const observer = new MutationObserver((records, observer) => inputManager.setMove());
observer.observe(board, {childList: true});

class AutoFillManager{

    autofill(){
        const {move, promotion, color} = inputManager.nextMove();
        if (!move){
            gs_suspend();
            return
        }
        let [ix0, ix1] = move;
        if([...board.classList].includes('flipped')){
            ix0 = 63 - ix0;
            ix1 = 63 - ix1;
        }
        let [y0, x0]= divmod(ix0);
        let [y1, x1]= divmod(ix1);
        const rect = board.getBoundingClientRect();
        x0 = Math.round(rect.left + rect.width / 8 * (x0 + .5));
        y0 = Math.round(rect.top + rect.height / 8 * (7.5 - y0));
        x1 = Math.round(rect.left + rect.width / 8 * (x1 + .5));
        y1 = Math.round(rect.top + rect.height / 8 * (7.5 - y1));
        board.dispatchEvent(new MouseEvent(
            'pointerdown',
            {clientX: x0, clientY: y0, bubbles:true}));
        board.dispatchEvent(new MouseEvent(
            'pointerup',
            {clientX: x1, clientY: y1, bubbles:true}));
        if(promotion){
            const className = 'promotion-piece '+ color + promotion.toLowerCase();
            const element = document.getElementsByClassName(className)[0]
            element.dispatchEvent(new MouseEvent('pointerdown'));
            element.dispatchEvent(new MouseEvent('pointerup'));
        }
    }
}
addAutofillListener(new AutoFillManager());
gs_retry.addEventListener('click', ev => inputManager.setMove(), {passive: true})
