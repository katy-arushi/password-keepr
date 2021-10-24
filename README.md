# passwordb 🔑

**passwordb** is a password generator and manager that creates and stores passwords for individuals and groups.

## Features
- Generates passwords based on user's specifications
- Allows users to join organizations to see all an organization's passwords.
- Allows an organization to invite users to view their **passwordb** vault.

### Known Issues
- Responsive design not fully implemented.

## Screenshots

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
     - username: `labber` 
     - password: `labber` 
     - database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
     - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
     - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`

## Warnings & Tips

- Split database schema (table definitions) and seeds (inserts) into separate files, one per table. See `db` folder for pre-populated examples. 
  
## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x



