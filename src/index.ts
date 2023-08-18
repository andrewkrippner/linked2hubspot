import { promptUser } from './promptUser'
import {
    getHubspotClient,
    getHubspotContactId,
    syncHubspotContact,
} from './hubspot'
import { readLinkedInConnections } from './linkedInConnection'

const linked2HubSpot = async () => {
    const accessToken = process.env.HUBSPOT_ACCESS_TOKEN!
    const dealStage = process.env.HUBSPOT_DEAL_STAGE_ID
    const hubspotClient = getHubspotClient(accessToken)
    const linkedInConnections = readLinkedInConnections()
    const maxNameLength = Math.max(
        ...linkedInConnections.map(
            (linkedInConnection) =>
                `${linkedInConnection.firstName} ${linkedInConnection.lastName}, ${linkedInConnection.position}`
                    .length
        )
    )
    for (const [i, linkedInConnection] of linkedInConnections.entries()) {
        const name = `${linkedInConnection.firstName} ${linkedInConnection.lastName}, ${linkedInConnection.position}`
        const whiteSpace = Array(maxNameLength - name.length).join(' ')
        const progress = `(${i + 1}/${linkedInConnections.length})`

        if (!linkedInConnection.email) {
            console.log(
                `⏭️\t${progress}\t\t${name}${whiteSpace}Sync Skipped, No Email`
            )
            continue
        }
        const contactId = await getHubspotContactId(
            hubspotClient,
            linkedInConnection.email
        )
        if (contactId) {
            console.log(
                `⏭️\t${progress}\t\t${name}${whiteSpace}Sync Skipped, Duplicate`
            )
            continue
        }
        const prompt = contactId
            ? `?\t${progress}\t\t${name}${whiteSpace}Update Contact? (y/n)`
            : `?\t${progress}\t\t${name}${whiteSpace}Create Contact? (y/n)`
        const res = await promptUser(prompt)
        if (res !== 'y') {
            console.log(
                `⏭️\t${progress}\t\t${name}${whiteSpace}Sync Skipped By User`
            )
            continue
        }
        try {
            await syncHubspotContact(
                hubspotClient,
                linkedInConnection,
                dealStage,
                contactId
            )
            console.log(`✅\t${progress}\t\t${name}${whiteSpace}Sync Succeeded`)
        } catch (e) {
            console.log(`❌\t${progress}\t\t${name}${whiteSpace}Sync Failed`)
        }
    }
}

linked2HubSpot()
