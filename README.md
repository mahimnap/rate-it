# Rate-It

A social media app based on reviewing various mediums of entertainment including books, movies, music and tv shows. 

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Installation

1. Prerequisites: MySQL, Node.js
2. Clone the repository: git clone https://github.com/mahimnap/rate-it.git
3. Navigate to the project directory: cd rate-it
4. Install dependencies: npm install (on both server and client directories, respectively)
5. Ensure active MySQL server
6. Setup tables (can run sql scripts in 'models' directory)
7. After both client and server dependencies are installed, npm run build in client directory 
8. Finally, node server.js in server directory

## Usage

'''
cd client; 
npm install; 
npm run build;
cd ../server;
<create .env and set mysql password and session secret (MYSQL_PWD and SESSION_SECRET)>
<ensure server is configured and running - e.g. locally hosted community server: Start-Service -Name [server name]> 
npm install; 
node server.js
'''

## Features

- Account that holds reviews 
- Social media aspects allowing users to like each others posts
- Primarily focused on backend thus far, so very basic frontend at the moment. 
- More account features and significant modifications to UI design to come! 

## Improvements Thus Far

## Design Trade-Offs