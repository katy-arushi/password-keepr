# passwordb 🔑

**passwordb** is a password generator and manager that creates and stores passwords for individuals and groups.

---
A [Lighthouse Labs](https://www.lighthouselabs.ca/) project by [Arushi Katyal](https://github.com/katy-arushi), [Olivia Wong](https://github.com/OliviaWong-dev), and [Esra Saatci](https://github.com/esra-saatci).

---

## Features
- ⭐️ Generates passwords based on user's specifications (uppercase, lowercase, numbers, symbols, length)
- ⭐️ Complete login, register, logout and delete account functionality with data validation
- ⭐️ Allows users to join organizations to see all an organization's passwords.
- ⭐️ Allows an organization to add users to view their **passwordb** secure accounts.
  
### Future Features
- Fully implement responsive design for mobile and tablet.
- Use bcrypt for password hashing/encryption.
- Add 'My Account' page to allow a user to change their **passwordb** email and password.
- Implement search bar function to allow a user to search their passwords.

## Screenshots
!["passwordb homepage"](https://github.com/katy-arushi/password-keepr/blob/master/docs/home.png?raw=true)
!["passwordb login"](https://github.com/katy-arushi/password-keepr/blob/master/docs/login.png?raw=true)
!["passwordb register"](https://github.com/katy-arushi/password-keepr/blob/master/docs/register.png?raw=true)
!["passwordb accounts](https://github.com/katy-arushi/password-keepr/blob/master/docs/accounts.png?raw=true)
!["passwordb add account](https://github.com/katy-arushi/password-keepr/blob/master/docs/add_account.png?raw=true)
!["passwordb edit password](https://github.com/katy-arushi/password-keepr/blob/master/docs/edit_pass.png?raw=true)

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
     - username: `labber` 
     - password: `labber` 
     - database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
     - Check the db folder to see what gets created and seeded in the DB
7. Run the server: `npm run local`
     - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`
  
## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
