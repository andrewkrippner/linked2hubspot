import { promptUser } from './promptUser'
import { getHubspotClient, syncHubspotContact } from './hubspot'
import { getLinkedInConnections } from './getLinkedInConnections'

const linked2HubSpot = async () => {
    const accessToken = await promptUser('Enter HubSpot Access Token: ')
    const dealStage = await promptUser('Enter HubSpot Deal Stage: ')
    const hubspotClient = getHubspotClient(accessToken)
    const connections = getLinkedInConnections()
    for (const [i, connection] of connections.entries()) {
        const prompt = `(${i + 1}/${connections.length}) Sync ${
            connection.firstName
        } ${connection.lastName}, ${connection.position} @ ${
            connection.companyName
        } (${connection.linkedIn})? (y/n) `

        if (!connection.email) {
            console.log(prompt)
            console.log('\tSync Skipped, No Email')
            continue
        }
        const res = await promptUser(prompt)
        if (res !== 'y') {
            console.log('\tSync Skipped')
            continue
        }
        try {
            await syncHubspotContact(hubspotClient, connection, dealStage)
            console.log('\tSync Succeeded')
        } catch (e) {
            console.log('\tSync Failed')
        }
    }
}

linked2HubSpot()
