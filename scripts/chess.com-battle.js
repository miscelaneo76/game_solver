gs_warn.style.display = 'block';
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        gs_warn.style.display = 'none';
        game_solver.style.display = 'block';
        inputManager.addPuzzles(request.puzzles);
    });
