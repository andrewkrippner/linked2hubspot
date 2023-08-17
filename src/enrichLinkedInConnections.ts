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
    const connections = readLinkedInConnections()
    let n = 0
    for (const connection of connections) {
        if (n >= 50) break
        if (connection.email || !connection.linkedIn) continue
        try {
            const enriched = await getEnrichedLinkedInConnection(
                connection,
                process.env.APOLLO_API_KEY!
            )
            n++
            if (enriched?.person?.contact?.email_status === 'verified') {
                connection.email = enriched.person.contact.email
                console.log(
                    `Found email for ${connection.firstName} ${connection.lastName}: ${connection.email}`
                )
            }
        } catch (e) {
            console.error(e)
            break
        }
    }
    writeLinkedInConnections(connections)
}

enrichLinkedInConnections()
