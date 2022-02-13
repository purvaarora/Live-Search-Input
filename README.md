# Getting Started with Live Search Input
## Problem Statement

As a user I should be able to filter managers
## Acceptance Criteria

- When user clicks into the input field, he/she sees the full list of managers
- The list shows up to 2 managers, the rest can be seen by scrolling inside the list.
- When user starts typing into the input field, matching results appear in the list.
    - Managers are filtered on both first name and last name. 
    - Filtering is case insensitive.
    - Managers are filtered across first name and last name (eg. "tMc" => Harriet McKinnley.)
- When user confirms the selection with the enter key, the full name of the selected manager is displayed in the input field and the list of available managers hides. (Bonus)
- User can navigate the list of managers with arrow up and arrow down keys. (Bonus)
- When the input loses focus, the list of available managers disappears and the entered value is being kept. When the user clicks back into the input field a list of filtered managers by the kept value is shown. 

## Installation
After cloning the repository, run the following commands
```sh
npm install
npm run start
```
## To run test cases
```sh
npm run test
```