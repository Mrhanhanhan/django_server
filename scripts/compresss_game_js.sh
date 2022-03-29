#! /bin/bash

JS_PATH=/c/Users/han/Desktop/django_server/django_server/game/static/js/


JS_PATH_DIST=${JS_PATH}dist/
JS_PATH_SRC=${JS_PATH}src/

find $JS_PATH_SRC -type f -name '*.js' | sort | xargs cat > ${JS_PATH_DIST}game.js
