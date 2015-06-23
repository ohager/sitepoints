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
2. Run database bootstrapper
2. Launch the MongoDb (from project root path)
  `mongod --dbpath ./data --auth`
3. Start node.js application (from project folder)
  `npm start`
  
Note:

For Windows exist a batch file that starts up both node.js and MongoDb.
Just call `start.bat`

Run MongoDB Bootstrapper
------------------------

The bootstrapper initializes the data base, i.e. creates a default user and some startup data.
It is important that the `mongod` runs *without* enabled authorization, otherwise you won't get the script run.
When mongo server is running simply call `mongo mongo-bootstrap.js`.

The default user is `sitepoints`. Password is the same.









