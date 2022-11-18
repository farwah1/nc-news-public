# NC NEWS

## Hosted API

### To use visit: https://ncnews.cyclic.app/


## Summary 

This project is an API to get news articles, post comments to a new article etc. To view what requests you can make, visit https://ncnews.cyclic.app/api which will show you all available endpoints and a description of their response.

## **WARNING**

 To run this project you will need Node.js v18.10.0 and Postgres v8.7.3.

## Instructions 

## 1. Clone Repo

Fork this repository: https://github.com/farwah1/nc-news-public and clone down to your local machine.

## 2. Install Dependencies

### To install node-postgres run: 
'$ npm install pg'

### To install dotenv run:
'$ npm install dotenv --save'

### To install express run:
'$ npm install express'

## 3. To Connect to the Databases Locally

### In order to successfully connect to the two databases locally, create two files: <br />
.env.test <br />
.env.development

### Into each file, add PGDATABASE=<database_name_here>, with the correct database name for that environment. <br />
.env.test will contain PGDATABASE = nc_news_test <br />
.env.development will contain PGDATABASE = nc_news

## 4. Seeding

Use the seed script provided in the package.json and run <br />
'$ npm run setup-dbs'  <br />
to run the setup.sql file to create the databases.