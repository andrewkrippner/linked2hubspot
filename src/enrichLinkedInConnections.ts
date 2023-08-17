import axios from 'axios'
import {
    LinkedInConnection,
    readLinkedInConnections,
    writeLinkedInConnections,
} from './linkedInConnection'

export const getEnrichedLinkedInConnection = async (
    linkedInConnection: LinkedInConnection,
    apiKey: string
) => {
    const url = 'https://api.apollo.io/v1/people/match'
    const headers = {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
    }
    const data = {
        api_key: apiKey,
        email: linkedInConnection.email,
        first_name: linkedInConnection.firstName,
        last_name: linkedInConnection.lastName,
        organization_name: linkedInConnection.companyName,
        reveal_personal_emails: true,
    }
    const res = await axios.post(url, data, { headers })
    return res.data
}

const enrichLinkedInConnections = async () => {
    const totalToEnrich = 50
    const startLineNumber = parseInt(process.argv[2]) ?? 2
    const connections = readLinkedInConnections()
    let n = 0
    for (const connection of connections.slice(startLineNumber - 2)) {
        if (n >= totalToEnrich) break
        if (!connection.linkedIn) {
            console.log(
                `⚠️ (${startLineNumber + n})\t\tLine incorrectly formatted`
            )
            continue
        }
        if (connection.email) {
            console.log(
                `🟡 (${startLineNumber + n})\t${connection.firstName} ${
                    connection.lastName
                }\t\tAlready have email`
            )
            continue
        }
        try {
            const enriched = await getEnrichedLinkedInConnection(
                connection,
                process.env.APOLLO_API_KEY!
            )
            if (enriched?.person?.contact?.email_status === 'verified') {
                connection.email = enriched.person.contact.email
                console.log(
                    `✅ (${startLineNumber + n})\t${connection.firstName} ${
                        connection.lastName
                    }\t\tFound email: ${connection.email}`
                )
            } else {
                console.log(
                    `❌ (${startLineNumber + n})\t${connection.firstName} ${
                        connection.lastName
                    }\t\tNo email found`
                )
            }
            n++
        } catch (e) {
            console.error(e)
            break
        }
    }
    writeLinkedInConnections(connections)
}

enrichLinkedInConnections()
