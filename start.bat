@echo off
set sitepointsdir="c:\Programmierung\nodejs\projects\sitepoints"

echo Starting mongodb...
start start-mongodb.bat

echo Starting node.js App
cd %sitepointsdir%
call npm start

