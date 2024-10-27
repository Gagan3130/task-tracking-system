# Task Tracking API
This is a task tracking and management application that facilitates collaboration and organization within teams or projects. The application allow users ,based on their roles in a project, to create, assign, and track tasks, as well as collaborate with team members through comments and attachments. Updating any task will also send real time notification to person assigned to that task using socket.io library

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Installation

 1. Clone the repository:

```bash
git clone https://github.com/Gagan3130/task-tracking-system.git
cd task-tracking-system
```
  2. Install dependencies:

```bash
npm install
```

   3. Create a .env file in the root directory with the following environment variables:

```bash
JWT_SECRET_KEY = YOUR_JWT_SECRET_KEY
MONGO_URI = MONGO_CONNECTION_STRING
```

4. Start the server:

```bash
npm start
```
The server will run on http://localhost:4000.

## API Endpoints

1. User Registration

    POST /api/users/signup

    Registers a new user.
    ```bash
    curl --location 'localhost:4000/api/users/signup' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "name": "john weasley",
    "email": "john@gmail.com",
    "password": "abcde@123",
    "jobTitle": "Back end developer",
    "Organisation": "Atlassian"
    }'
    ```
    Response:

    201 Created on success with user details and token

    4xx Bad Request if validation fails


2. User Login

    POST /api/users/login

    ```bash
   curl --location 'localhost:4000/api/users/login' \
   --header 'Content-Type: application/json' \
   --data-raw '{
    "email": "john@test.com",
    "password": "abcde@123"
   }'
    ```
   200 on successfull login with user details and token

   4xx Bad Request if validation fails

3. Updating user profile
   
    PUT /api/users

    ```bash
    curl --location 'localhost:4000/api/users' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: ••••••' \
    --data '{
    "name": "XYZ",
    "jobTitle": "Software Engineer",
    "Organisation": "Atlas"
    }'
   ```
   200 on successfull updation of user profile

   4xx Bad Request if validation fails

4. Project Creation

    POST /api/project

    ```bash
   curl --location 'localhost:4000/api/project' \
   --header 'Content-Type: application/json' \
   --header 'Authorization: ••••••' \
   --data '{
    "projectName": "Airtribe apis"
   }'
    ```
    200 on successfull register for project

    4xx Bad Request if validation fails

5. Project Details

    GET /api/project/:projectId

    ```bash
    curl --location 'localhost:4000/api/project/670ccdd9bd13042368f14e50' \
    --header 'Authorization: ••••••'
    ```   
    200 on successfull retrieving the project details

    403 access denied error if user is not a member of the project or does not have the relevant permission

6. All Projects list assigned to me

    GET /api/project

    ```bash
    curl --location 'localhost:4000/api/project' \
    --header 'Authorization: ••••••'
    ```   
    200 on successfull retrieving the list of all projects that I am member of in the system


7. Invite a member to a project

    POST /api/project/invite/:projectId

    ```bash
    curl --location 'localhost:4000/api/project/invite/670ccdd9bd13042368f14e50' \
   --header 'Content-Type: application/json' \
   --header 'Authorization: ••••••' \
   --data '{
    "userId": "670d386f2c171dc91f6afc1c",
    "role": "viewer"
   }'
    ```   
    200 on successfull sent an invitation to a user which should be the user of the task tracking system

    403 access denied error if user is not a member of the project or does not have the relevant role i.e  admin or member can only invite another user

8. Create a new task

    POST /api/project/:projectId/tasks

    ```bash
   curl --location 'localhost:4000/api/project/670ccdd9bd13042368f14e50/tasks/' \
   --header 'Content-Type: application/json' \
   --header 'Authorization: ••••••' \
   --data '{
    "title": "admin Dashboard",
    "description": "Admin dashboard with line charts and pie charts"
   }'
    ```   
    201 on successfull create a new task in a project

    400 if a validation fails

    403 access denied error if user is not a member of the project or does not have the relevant role i.e  admin or member can only create new task    
   
9. Get all task in a project

    GET /api/project/:projectId/tasks

    ```bash
   curl --location 'localhost:4000/api/project/670ccdd9bd13042368f14e50/tasks/' \
   --header 'Content-Type: application/json' \
   --header 'Authorization: ••••••' \
    ```   
    200 on successfull retriveing all tasks in a project

    400 if a validation fails

    403 access denied error if user is not a member of the project or does not have the relevant role

10. Get all task that are assigned to me in a project

    GET /api/project/:projectId/tasks/assigned-to-me

    ```bash
   curl --location 'localhost:4000/api/project/670ccdd9bd13042368f14e50/tasks/assigned-to-me' \
   --header 'Authorization: ••••••'
    ```   
    200 on successfull retriveing all tasks that are assigned to me in a project

    400 if a validation fails

    403 access denied error if user is not a member of the project or does not have the relevant role

11. Updating Task details

    PUT /api/project/:projectId/tasks/:taskId

    ```bash
   curl --location --request PUT 'localhost:4000/api/project/670ccdd9bd13042368f14e50/tasks/670cdcb6ccbb799ba87bcbff' \
   --header 'Authorization: ••••••'
    ```   
    200 on successfull updating the task details

    400 if a validation fails

    403 access denied error if user is not a member of the project or does not have the relevant role i.e  admin or member can only update task

12. Get Task details

    GET /api/project/:projectId/tasks/:taskId

    ```bash
   curl --location --request GET 'localhost:4000/api/project/670ccdd9bd13042368f14e50/tasks/670cdcb6ccbb799ba87bcbff' \
   --header 'Authorization: ••••••'
    ```   
    200 on successfull retrieving the task details

    400 if a validation fails

    403 access denied error if user is not a member of the project or does not have the relevant role 

13. Post New Comment in a task

    POST /api/project/:projectId/tasks/:taskId/comments

    ```bash
   curl --location 'localhost:4000/api/project/670ccdd9bd13042368f14e50/tasks/670cdc60ccbb799ba87bcbfa/comments' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: ••••••' \
  --data '{
    "content": "is EPC offer completed?"
  }'
    ```   
    201 on successfull posting new comment in a task

    400 if a validation fails

    403 access denied error if user is not a member of the project or does not have the relevant role   

14. Post a reply to a Comment

    POST /api/project/:projectId/tasks/:taskId/comments/:commentId/reply

    ```bash
   curl --location 'localhost:4000/api/project/670ccdd9bd13042368f14e50/tasks/670cdc60ccbb799ba87bcbfa/comments/67151febc5db280bd68abdb9/reply' \
   --header 'Content-Type: application/json' \
   --header 'Authorization: ••••••' \
   --data '{
    "content": "Cool ok lets connect soon!👍"
   }'
    ```   
    201 on successfull posting a reply to a comment

    400 if a validation fails

    403 access denied error if user is not a member of the project or does not have the relevant role

14. Delete a comment

    POST /api/project/:projectId/tasks/:taskId/comments/:commentId/remove-comment

    ```bash
   curl --location --request POST 'localhost:4000/api/project/670ccdd9bd13042368f14e50/tasks/670cdc60ccbb799ba87bcbfa/comments/67151febc5db280bd68abdb9/remove-comment' \
   --header 'Authorization: ••••••'
    ```   
    200 on successfull deleting the comment

    400 if a validation fails

    403 access denied error if user is not a member of the project or does not have the relevant role 

15. get all comments in a task

    POST /api/project/:projectId/tasks/:taskId/comments

    ```bash
   curl --location 'localhost:4000/api/project/670ccdd9bd13042368f14e50/tasks/670cdc60ccbb799ba87bcbfa/comments' \
   --header 'Authorization: ••••••'
    ```   
    200 on successfull retrieving all the comments in a task

    400 if a validation fails

    403 access denied error if user is not a member of the project or does not have the relevant role             

     



    