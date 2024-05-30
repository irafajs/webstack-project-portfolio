WEBSTACK-PROJECT-PORTFOLIO FINAL

This is a readme for the end project of my SE journey at ALX

First of all, I want to thank ALX for choosing me to participate in this experience it was not ease, they were time I doubted myself that I would not finish, but here I am referencing to the first time I opened ALX page to register, wrong story shot, I am grateful.

Our application at full capacity should be a management application for a small store, boutique, or supermarket.

to run it you have to install dependencies:
	to install them run: 
npm init -y
npm install bcrypt csv-parser dotenv express mongodb multer nodemon sha1 uuid

this dependencies assist to run the code, for example bcrypt will be used to encrypt the password, melter to handle file upload and so on.

We have our app.js file that runs the whole routes.

We have our routes directory that set and import all routes to be used.
We have storage to handle the DB connection.
We have uses to handle users creation.

The user for this store are of 2 type

Administrator (manager of the store), in charge of the store overall, create cashier users, upload the new stock item… 

Cashier users will be able to sel, cashier can edit the data only by removing the scanned item, increasing item number is not possible.





