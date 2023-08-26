# Snowflake Data Entry

A Node.js-app and simple front-end, designed to enter, edit, and delete data that lives in a Snowflake database.

## Features

- **Secure Connection**: Using Snowflake's Node SDK to establish a connection to Snowflake
- **Environment Variables**: This repo uses a `.env` file for safeguarding passwords and Snowflake database context. 
- **Simple, friendly front-end**: The HTML file and CSS is aimed at being simple and easy to use

## Getting Started
### Prerequisites

- Have [Node.js](https://nodejs.org/) installed.
- An active Snowflake account with the permissions to create a user, warehouse, database, and table.

### Prep Snowflake

1. **Create your Database**: (naming convention does not matter)
2. **Create your Schema** (namving convention does not matter)
3. **Create your table**:  Naming does matter, the code in this repo references a table named 'MY_RECORDS'
4. **Here is the table DDL**
```
create or replace <DATABASE>.<SCHEMA>.MY_RECORDS (
	ID NUMBER(38,0) NOT NULL autoincrement,
	NAME VARCHAR(16777216),
	EMAIL VARCHAR(16777216),
	LAST_UPDATED TIMESTAMP_TZ(9),
	primary key (ID)
);
```

### Installation

1. **Clone the Repository**:
```
git clone https://github.com/markurquhart/snowflake-data-entry.git
```
2. **Navigate to the Project Directory**:
3. **Install Dependencies**:
```
npm install
```
4. **Configure Environment Variables**: Create a `.env` file in the project's root and input your details:
```
SNOWFLAKE_ACCOUNT=< account url>
SNOWFLAKE_USERNAME= <username>
SNOWFLAKE_PASSWORD= <password>
SNOWFLAKE_ROLE= <role>
SNOWFLAKE_WAREHOUSE= <warehouse>
SNOWFLAKE_DATABASE= <database>
SNOWFLAKE_SCHEMA= <schema>
```

### Usage

1. **Launch the Application**:
```
node server.js
```
## Contributing
Pull requests welcome. Fork/clone, branch and then PR with ample description and comments within code (thanks!)

## License

I don't think this falls under a specific license, but if it does let me know!
