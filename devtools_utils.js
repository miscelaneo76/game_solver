export const addRequestListener = struct => {
    chrome.devtools.network.onRequestFinished.addListener(request => {
        if(request.request.method == struct.method && struct.url.test(request.request.url)){
            request.getContent(body => {
                chrome.tabs.sendMessage(
                  chrome.devtools.inspectedWindow.tabId,
                  'processBody' in struct ? struct.processBody(body) : JSON.parse(body)
                )
            });
        }
    });
}