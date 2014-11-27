@echo off
set mongodir="c:\Programmierung\mongodb\bin"
set sitepointsdir="C:\Programmierung\nodejs\projects\sitepoints"

echo Starting mongodb...
call %mongodir%\mongod --dbpath %sitepointsdir%\data --auth


