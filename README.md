# Web Based App Project

## Functionality

#### DataEntry

We have made an extendable data entry application which allows users to load
different forms (only MorbidityForm is implemented), enter data into it, and
submit it to the API. This works very well offline as well

* Select organization unit, month and year
* MorbidityForm
    * Fill in data into the form into rows
    * Add/Delete row
    * Minimize/Maximize row
        * In minimized form, only displays some aggregated information
        * Meant to save screenspace for the user and reduce cognitive load
    * Submit form
        * Form will be somewhat validated before submission
        * Confirmation Box before submitting
        * On submit, the user will get a confirmation/error popup
        * Forms will be stored in localstorage and be displayed in "My Forms"

#### My Forms

This page is a list of all forms the user has submitted. This will also display
forms which have been submitted, but not successfully, for instance when you
have no internet. For these forms a resubmit button is present, which will try
to submit these forms again. This list persists through reload, as the forms
are stored in localstorage. There is also functionality for viewing a form in
an uneditable state, and deleting a form in the list (only locally).

* See list of forms (Org unit, month, year)
* Submission status / Resubmit button
* View form button
    * Takes you to an uneditable version of DataEntry (same component)
    * When viewing, get back to My Forms with a back button
* Delete form button
    * Confirmation box gives info and explains that it will only delete locally
* Pagination, prev/next page functionality

#### Missing functionality

* We did want to have an "All forms" page, which displays all forms, not only your own.
* Form validation is lacking.
* Styling could be better.

## Installation

#### Install dependencies
Install yarn:
```
npm install -g yarn
```
Install the DHIS2 CLI and the proxy portal:
```
yarn global add @dhis2/cli dhis-portal
```

#### Start proxy
```
npx dhis-portal --target=https://verify.dhis2.org/in5320
```

#### Start application
```
cd dataentry && yarn start
```

#### Access the application
The app should be running on localhost port 3000. Log in with the following credentials:
- Server: http://localhost:9999
- Username: admin
- Password: district
