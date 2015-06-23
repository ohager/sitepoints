@echo off

echo Starting mongodb...
start start-mongodb.bat

echo Starting node.js App
call npm start

