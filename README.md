This repository contains code for a web application that integrates with various AWS services using the AWS Amplify library and Flask.

The application allows users to:

1. Register and login using AWS Cognito
2. Upload images to an S3 bucket using Amplify Storage
3. View a collection of uploaded images and delete or share them
4. Generate a pre-signed URL for a selected image
5. Logout of the application


How to run project:

Link to hosted project: http://myprojectfrontend-20230227205729-hostingbucket-dev.s3-website.us-east-2.amazonaws.com

Running locally:
1. Start flask application in a terminal: FLASK_APP=app.py flask run
2. Go into myproject-frontend directory and start react code in another terminal: npm start

This will open a react login/register page on browser at http://localhost:3000/



How I used AWS Services:
1. Used AWS S3 for storage container
2. Used AWS Cognito for user login pool
3. Used AWS Amplify for frontend and authentication of project


1. Create an account with legit email and password. After creating an account, a code will be sent to your email. Verify your account through the code. Password should be 8 character long. 
2. Once you login, we can upload images from through "Choose File" button and then "upload" button. 
3. Refresh page to load the recent image uploaded. Images are directly saved to S3 bucket of that particular user. 
4. One can upload multiple images one by one and see the images displayed on frontend. 
5. To delete/remove an image from album, click on "Delete" button below a particular image. 
6. To logout, click on "Sign Out" button. 


To show how it works, I have created a screenshots folder which has all the images. 
