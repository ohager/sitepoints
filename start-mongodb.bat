@echo off
set sitepointsdir=%CD%

echo Starting mongodb...
call mongod.exe --dbpath "%sitepointsdir%\data"


