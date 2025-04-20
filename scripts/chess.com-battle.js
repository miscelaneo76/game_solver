gs_warn.style.display = 'block';
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        gsInit();
        inputManager.addPuzzles(request.puzzles);
    });
