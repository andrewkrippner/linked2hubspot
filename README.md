## LinkedIn Connections to HubSpot Contacts

linked2hubspot is a Node CLI tool that processes LinkedIn connection data, uploads it to HubSpot Contacts, and optionally creates HubSpot Deals.

### Setup HubSpot API

-   Setup an access token for the [HubSpot API](https://developers.hubspot.com/docs/api/overview)
-   Your HubSpot account must be setup with the following properties:
    -   "linkedin" on the Contact object (string)
    -   "linkedinconnectiondate" on the Contact object (date)
    -   "leadsource" on the Contact object (string)
    -   "lead_source" on the Deal object
-   Note: This program creates deals for each new contact in the "default" pipeline

### Download LinkedIn Data

-   Go to LinkedIn's [personal data download page](https://www.linkedin.com/mypreferences/d/download-my-data)
-   Click “Want something in particular? Select the data files you're most interested in.”, “Connections”, and “Request Archive”
-   Check your email in about ten minutes and download the .csv file
-   Rename the file to “connections.csv” and place in this root directory

### Install Dependencies

-   Run `yarn`

### Configure

-   Set HUBSPOT_ACCESS_TOKEN env variable
-   Optional: Set HUBSPOT_DEAL_STAGE_ID env variable
-   Optional: Set APOLLO_API_KEY env variable

### Run

-   Run `yarn start`
-   Enter HubSpot Access Token
-   Enter a Deal Stage ID to create a new Deal at the given Deal Stage for new contacts. If left blank, no Deal will be created
-   Enter "y" or "n" for each Linked In Connection to import or skip each connection respectively
