Sitepoints Project
==================

This project is about storing coordinates and timestamps related to URLs.
The idea is to use this information to interpret the usage of websites.

It is build on node.js with express (for a RESTful API) and MongoDB.

Installation
=============

Prerequisites
-------------

- Installed MongoDB 2.6.5+
- Installed Node.Js (1.4+)

1. Just checkout the project
2. Launch the MongoDb (from project root path)
  `mongod --dbpath ./data`
3. Start node.js application (from project folder)
  `npm start`
  
Note:

For Windows exist a batch file that starts up both node.js and MongoDb.
Just call start.bat


(*) There is still a problem with global node.js dependencies, I'll resolve this soon.

For Developers
--------------

To setup the project for developement it is recommended to run the MongoDB bootstrapper. That guy initializes the data base
with some startup data. Simply run `mongo mongo-bootstrap.js`.







