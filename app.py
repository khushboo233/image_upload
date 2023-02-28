from urllib import response
from flask import Flask, request, jsonify, render_template
import boto3
import os

from botocore.exceptions import ClientError
from botocore.config import Config

# Create a Session object with the desired region
session = boto3.Session(region_name='us-east-2')
s3 = boto3.resource("s3").Bucket("samp12")

app = Flask(__name__)
cognito = session.client('cognito-idp')


@app.route('/')
def hello_world():
    return 'Hello Seattle!'


@app.route('/register', methods=['POST'])
def register():
    email = request.json['email']
    password = request.json['password']
    try:
        response = cognito.sign_up(
            ClientId='1au9fv88r5fnqikmtdmcjoukob',
            Username=email,
            Password=password,
            UserAttributes=[
                {
                    'Name': 'email',
                    'Value': email
                }
            ]
        )
        return jsonify({'message': 'User registered successfully'})
    except ClientError as e:
        return jsonify({'error': str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']
    try:
        response = cognito.initiate_auth(
            ClientId='1au9fv88r5fnqikmtdmcjoukob',
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': email,
                'PASSWORD': password
            }
        )
        access_token = response['AuthenticationResult']['AccessToken']
        return jsonify({'access_token': access_token})
    except ClientError as e:
        return jsonify({'error': str(e)}), 401

@app.route('/logout', methods=['POST'])
def logout():
    access_token = request.headers.get('Authorization')
    if access_token:
        try:
            cognito.global_sign_out(
                AccessToken=access_token
            )
            return jsonify({'message': 'User logged out successfully'})
        except ClientError as e:
            return jsonify({'error': str(e)}), 400
    else:
        return jsonify({'error': 'Access token not found in headers'}), 400



@app.route('/upload', methods=["GET","POST"])
def uploadimage():
    if request.method == 'POST':
        img = request.files.getlist("image")
        if img:
            for i in img:
                s3.upload_fileobj(i, i.filename)
            msg = "Upload done"
        return render_template("upload.html", msg=msg)
    return render_template("upload.html")


@app.route('/getURL', methods=["GET","POST"])
def getURL():
    try:
        if request.method == 'POST':
            imgkey = request.form("imagekey")
            url = boto3.client('s3').generate_presigned_url(
                ClientMethod='get_object', 
                Params={'Bucket': 'samp12', 'Key': imgkey},
                ExpiresIn=3600
            )
        return jsonify({'url': url})
    except ClientError as e:
        return jsonify({'error': str(e)}), 401


if __name__ == '__main__':
    app.run()
