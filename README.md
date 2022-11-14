## To Connect to Databases Locally

In order to successfully connect to the two databses locally you need to create these two files:
.env.test
.env.development

Into each file, add PGDATABASE=<database_name_here>, with the correct database name for that environment.
.env.test will contain PGDATABASE = nc_news_test
.env.development will contain PGDATABASE = nc_news