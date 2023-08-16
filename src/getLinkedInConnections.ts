import fs from 'fs'
import { parseCSV } from './parseCSV'
import { transformDate } from './transformDate'
import { LinkedInConnection } from './types'

export const getLinkedInConnections = (): LinkedInConnection[] => {
    const csv = fs.readFileSync('./connections.csv', 'utf-8')
    const connections = parseCSV(csv).map((c) => ({
        firstName: c['First Name'],
        lastName: c['Last Name'],
        linkedIn: c['URL'],
        email: c['Email Address'],
        companyName: c['Company'],
        position: c['Position'],
        linkedInConnectDate: transformDate(c['Connected On']),
    }))
    return connections
}
