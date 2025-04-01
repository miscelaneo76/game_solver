import {addRequestListener} from '../devtools_utils.js'

let struct = {
    method: 'POST',
    url: new RegExp('^https://www.duolingo.com/2017-06-30/sessions$')
}
addRequestListener(struct);

struct = {
    method: 'GET',
    url: new RegExp('^https://stories.duolingo.com/api2/stories/')
}
addRequestListener(struct);
