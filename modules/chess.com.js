import {addRequestListener} from '../devtools_utils.js'
let struct = {
    method: 'GET',
    url: new RegExp('^https://www.chess.com/service/battle/games/\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12}/puzzles?withPuzzles=true')
}
addRequestListener(struct);

struct = {
    method: 'GET',
    url: new RegExp('^https://www.chess.com/callback/tactics/battles/\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12}')
}
addRequestListener(struct);

