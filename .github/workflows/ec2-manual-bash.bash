#!/bin/bash
# This script will install and configure a node js application
# used this as a base https://medium.com/@rajani103/deploying-nodejs-app-on-aws-ec2-instance-step-by-step-1b00f807cdce

# install node verson manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# activate nvm 
. ~/.nvm/nvm.sh

# install node
nvm install 23


# update all packages, install git
yum update -y
yum install git -y

# clone repo
git clone #URL.git HERE#
cd #repo name
ls -ltr

#install repo dependancies
npm install

#run app
npm run start
#this will expose the application on port 80