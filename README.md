## Overview

This Chrome extension exposes solutions in gamicated tasks when solutions have already passed to front end. Also it lets autocomplete those solutions.

## Running this extension

1. Clone this repository.
2. Load this directory in Chrome as an [unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked).
3. Navigate to  page with an article element. Some examples:
    - https://lyricstraining.com/en
    - https://www.chess.com/puzzles/battle
    - https://www.chess.com/puzzles/rush
    - https://www.busuu.com/dashboard
    - https://www.duolingo.com/
4. Open the dev tools (Shit + Ctrl + I) if it's necessary
5. The extension will add a bar at the top of website giving the expected solution to type or click as long as solutions were captured in a request. It also gives the option to autocomplete with a constant gap clicking a button.

## Scope
    Games that retrieve answers in before taks were completed. So far we focus on games that have ranking (but should not a requirement to consider in this project).

## Ways to develop
    Follow these prioritized ways to retrieve answers:
        1. From HTML content
        2. From localtorage
        3. From javascript objects created by original app (instancing javascripts in world main)
        4. From requests through dev tools
