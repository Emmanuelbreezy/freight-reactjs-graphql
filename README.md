# FreightHub Frontend Coding Challenge - (Updated)

Welcome to the FreightHub frontend coding challenge! Please read the following instructions carefully.

**Your goal is to set up an application which enables the user to view and manage shipments.**

# Contents

-   [Business need](#business-need)
-   [Use cases](#use-cases)
-   [Evaluation criteria](#evaluation-criteria)
    -   [Technology requirements](#technology-requirements)
    -   [Code requirements](Criteria.md#must-have)
-   [How to submit](#how-to-submit)
-   [How to run API server](#how-to-run-api-server)
-   [Time limit](#time-limit)

# Business need

The main goal is for the user to check the shipments at a glance. This allows users to take faster decisions and plan ahead of time.

Providing information to the customer increases transparency and reduces communication issues.

# Use cases

- The user shall be able to:
  - See shipments in pages of 20 elements per page
  - Search by shipment id
  - Sort by different fields (e.g. id, name) in ascending/descending order
  - View the shipment information on a separate shipment details page
  - Update the shipment name (should persist when the page is reloaded)

The interactions should not refresh the page.

# Evaluation criteria

## Technology requirements

**React** and **JavaScript** are mandatory requirements. Apart from this, you can use any libraries, task runners and build processors. ES6 and TypeScript are highly encouraged.

## Code requirements

The full criteria for evaluating the coding challenge can be found [here](./Criteria.md).

# How to submit

- Clone this repository.
- A RESTful API for `shipments` is provided with the challenge. To run, follow: [How to run API server](#how-to-run-api-server)
- Create a new branch in your cloned implementation called `solution`.
- Deploy on netlify or heroku. (Nice to have)

**In order to be fair to all candidates, please refrain from sharing your solution on public repository hosting services such as GitHub and Bitbucket.**

# How to run API server

The boilerplate includes a small service for data fetching. The file `db.json` includes all the necessary data to achieve the goal. Please follow the steps below to start the server:

```
yarn or npm install .
yarn server or npm run server
```

Check [json-server](https://github.com/typicode/json-server) for more information.

# Time limit
5 days
