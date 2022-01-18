# Simple CRUD API Example

## Running the project
1. Go to the `code` folder
2. Install dependencies with `yarn install`
3. Start the project with `yarn dev`

## Todo
- [X] Add TypeScript support
- [X] Add hotreload functionality
- [X] Add linter to the project
- [X] Add Express as http server
- [ ] Add Pure node as http server
- [X] Add simple CRUD endpoints
- [X] Add basic middlewares
- [X] Add sqlite3 repo
- [ ] Add support for PostgreSQL and other SQL databases
- [ ] Add mongodb support
- [ ] Add data validation
- [ ] Improve error handling
- [ ] Add tests
- [ ] Dockerize solution

## Example requests
- Get all events `curl --location --request GET 'localhost:3000/api/v1/events'`
- Create new event `curl --location --request POST 'localhost:3000/api/v1/events' \
--header 'Content-Type: application/json' \
--data-raw '{
    "venueName": "Madison Square Garden, New York City, NY",
    "eventDate": "April 15th, 2022",
    "ownerContact": {
        "email": "bob.arcter@madisonsq.com",
        "firstName": "Bob",
        "lastName": "Arcter",
        "phone": "1234567890"
    }
}'`
- Get event with id 1
`curl --location --request GET 'localhost:3000/api/v1/events/1'`
- Update event with id 1 `curl --location --request PUT 'localhost:3000/api/v1/events/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "venueName": "Madison Square Garden, New York City, NYY",
    "eventDate": "April 15th, 2023",
    "ownerContact": {
        "email": "bob.arcter@madisonsq.com",
        "firstName": "Bobby",
        "lastName": "Arcter",
        "phone": "1234567890"
    }
}'`
- Delete event with id 1 `curl --location --request DELETE 'localhost:3000/api/v1/events/1'`