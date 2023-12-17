# Bilmart
Bilmart is a web app that allows the Bilkent University community to: buy or sell second-hand items, borrow or donate, and make posts for lost and found items.
## Motivation
BilMart is elaborately designed to enhance the Bilkent experience by allowing students and members of our community to find second-hand items and more in a faster and easier fashion.
## Goals
Building a platform for Bilkenters to: buy or sell second-hand items, borrow or donate desired items, and provide a place to look for lost and found items.
## Problem
At the start of every semester, many students need to purchase new books for their new courses; however, the textbooks are costly, and some students struggle to buy brand-new ones. Many students choose to buy second-hand books from friends or through Instagram or Facebook. However, sometimes it is hard to find the book you are looking for, or you may not know anyone selling the book. So, this web platform will allow students to find the books or other items that they seek.
## Features
- Posting lost items with images. If the owner of the item finds the post, they can message the user to get their item back.
- Users who post lost items will be instructed to obscure information about the item so that they can verify the users who claim that item.
- Posting secondhand items they wish to sell or put up for rent.
- Users can give course tags to their posts. For example, a book for CS223 can be tagged with that course
- Users can also categorize their posts by item type such as a book, clothing, electronics, etc.
- Users can open donations and set a donation goal.
- There will be a search engine that lets users find the items or posts they are looking for and the ability to sort posts based on post type, item category, and tags.
- In sign up and login pages the users will sign up and be verified by their Bilkent emails.
- Home feed that recommends posts to users that they can scroll through.
- User profile that contains all posts by category, profile photo
- Users who purchase items can later rate the user who was selling. The average rating of users will be visible on their profiles.
- For communication, the users can share their contact information with each other upon their approval.
- Notification page that displays updates on their posts, notifies when someone is interested in their item, updates users upon contact info sharing, and more.
## Why BilMart?
BilMart allows Bilkent community members to engage with all the above-mentioned features on one website instead of searching through several of them. Since BilMart only allows Bilkent University members to join, it is secure and customer-oriented.
# Build Instructions
## Prerequisites
### Node.js >= v18.17.0
To build this project, you will need Node.js with version 18.17.0 or higher. Refer to [npm docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for the installation progress. If you already have Node.js installed please check the verion with ```node -v```. If your verison is lower that 18.17.0, please [update your Node.js](https://mcengkuru.medium.com/how-to-update-node-js-to-any-version-a-step-by-step-guide-d4ce747ac50f). We reccomend Node.js verison 21.2.0 and npm version 10.2.3 as these are the versions used during development.
## Building
1. You should have a working IDE. In case you already do not have it, here are two links: Visual Studio Code and IntelliJ IDEA.
2. You need to clone/fork the repository.
3. If you have Visual Studio code, you can directly click on Clone git repository. If you do not have Visual Studio Code, you should download git desktop and access the repository from there. After successfully cloning the repository, you can open the file in your IDE in the folder where you cloned it. 
4. After opening the folder in the IDE, you need to make sure you are in the main branch. 
5. You will need to open two terminals. In the first one, you need to make sure you are in the ‘Bilmart MVC’ folder by writing this line: ```cd Bilmart\ MVC```. then you will run this line to download modules: ```npm i```.
6. In the second terminal, you will need to again open the ‘Bilmart MVC’ folder and then open the view folder by writing this line: cd view by using ```cd Bilmart\ MVC/view```. Inside the view folder, you will need to install node modules here too: ```npm i```. 
7. Returning to your IDE, you will need to run this line in the ‘Bilmart MVC’ folder: ```nodemon index.js```. 
And then in the view shell run: ```npm start```.
8. Running these two lines should automatically open this website: http://localhost:3000.
9. You have successfully accessed the website.
10. To terminate, you will need to run CTRL+C in both shells if you are using Windows and CMD+C if you are using Mac.
