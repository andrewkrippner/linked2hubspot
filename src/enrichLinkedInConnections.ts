import { enrichContact } from './enrichContact'
import {
    LinkedInConnection,
    readLinkedInConnections,
    writeLinkedInConnections,
} from './linkedInConnection'

export const enrichLinkedInConnection = async (
    linkedInConnection: LinkedInConnection
) => enrichContact(linkedInConnection)

const enrichLinkedInConnections = async () => {
    const maxApiCalls = 200
    const startLineNumber = parseInt(process.argv[2]) ?? 2
    let lineNumber = startLineNumber
    let numberApiCalls = 0
    const connections = readLinkedInConnections()
    for (const connection of connections.slice(startLineNumber - 2)) {
        if (numberApiCalls >= maxApiCalls) break
        if (!connection.linkedIn) {
            console.log(
                `⚠️ (${lineNumber})\t\t${Array(41).join(
                    ' '
                )}Line incorrectly formatted`
            )
            continue
        }
        const name = `${connection.firstName} ${connection.lastName}`
        const whiteSpace = Array(41 - name.length).join(' ')
        if (connection.email) {
            console.log(
                `🟡 (${lineNumber})\t${name + whiteSpace}Already have email`
            )
            continue
        }
        try {
            const enriched = await enrichLinkedInConnection(connection)
            if (enriched?.person?.contact?.email_status === 'verified') {
                connection.email = enriched.person.contact.email
                console.log(
                    `✅ (${lineNumber})\t${name + whiteSpace}Found email: ${
                        connection.email
                    }`
                )
            } else {
                console.log(
                    `❌ (${lineNumber})\t${name + whiteSpace}No email found`
                )
            }
            numberApiCalls++
        } catch (e: any) {
            console.error(e.response.data)
            break
        }
        lineNumber++
    }
    writeLinkedInConnections(connections)
}

enrichLinkedInConnections()
