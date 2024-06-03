WEBSTACK-PROJECT-PORTFOLIO FINAL

This is a readme for the end project of my SE journey at ALX
____________________________________________________________

Our application at full capacity should be a management application for a small store, boutique, or supermarket.

to run it you have to install dependencies:
	to install them run: 
npm init -y
npm install bcrypt csv-parser dotenv express mongodb multer nodemon sha1 uuid

this dependencies assist to run the code, for example bcrypt will be used to encrypt the password, melter to handle file upload and so on.

We have our app.js file that runs the whole routes.

We have our routes directory that set and import all routes to be used.
We have storage modules to handle the DB connection.
We have users modules to handle users creation.

The users for this store are of 2 types:
_______________________________________

Administrator (manager of the store), in charge of the store overall.

some of what he can do in oou app are: 
	Create cashier users, 
	Upload the new stock item…
	Edit the wrong caption of the cashiers 

Cashier users will be able to sell:
	Cashier can sell by reducing quantity of an item in numbers
	To edit item for the cashier is not possible.

TO CREATE AN ADMIN ACCCOUT WE NEED TO PROVIDE 
____________________________________________

FULLNAMES OF THE ADMIN, 
HIS EMAIL, AND 
PASSWORD. 

BELOW IS AN EXAMPLE OF HOW TO CREATE FROM CLI

curl 0.0.0.0:3000/adminusers -XPOST -H "Content-Type: application/json" -d '{ "fullNames": "BILLY RUGAMBA", "email": "billymuhi@gmail.com", "password": "New1234" }' ; echo ""

TO CREATE A CASHIER USER WE NEED TO :
________________________________________________

To be logged on as Admin otherwise it won't work.
Once we are logged on we can create a cashier by providing:

Fullnames,
email,
password and 
WorkId of the administartor who is creating the user.

run this command to crate a cashier

Admin logging in 
curl 0.0.0.0:3000/login -XPOST -H "Content-Type: application/json" -d '{ "workId": "0003", "password": "New123456789" }' ; echo ""

admin creating a cashier

curl 0.0.0.0:3000/cashiers -XPOST -H "Content-Type: application/json" -d '{"workId": "0001", "fullNames": "ISHIMWE Junior", "email": "juniorishi@gmail.com", "password": "New12345678" }' ; echo ""

TO UPLOAD A FILE WE NEED TO:
____________________________

MAKE SURE ADMIN IS LOGGED ON, IF NOT UPLOADING A FILE IS NOT POSSIBLE

ADMIN LOGGIN IN

curl 0.0.0.0:3000/login -XPOST -H "Content-Type: application/json" -d '{ "workId": "0003", "password": "New123456789" }' ; echo ""

ADMIN UPLOADING DOCUMENT

curl -X POST 0.0.0.0:3000/fileupload -H "Content-Type: multipart/form-data" -F "workId=0003" -F "fileUpload=@/home/vagrant/webstack-project-portfolio/testfile2.csv"

TO LOGIN AS A CASHIER NEED TO RUN:
__________________________________

curl 0.0.0.0:3000/cashierlogin -XPOST -H "Content-Type: application/json" -d '{ "workCashierId": "T0004", "password": "New12345678" }' ; echo ""

TO LOGOUT RUN THIS COMMAND:
____________________________

FOR CASHIERS:
___________

curl 0.0.0.0:3000/logout -XPOST -H "Content-Type: application/json" -d '{ "workCashierId": "T0004" }' ; echo ""

FOR ADMINS:
_________

curl 0.0.0.0:3000/logout -XPOST -H "Content-Type: application/json" -d '{ "workId": "0004" }' ; echo ""
