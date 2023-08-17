import fs from 'fs'
import { parseCSV } from './parseCSV'
import { createCSV } from './createCSV'
import {
    linkedInDate2HubSpotDate,
    hubSpotDate2LinkedInDate,
} from './transformDate'

export interface LinkedInConnection {
    firstName: string
    lastName: string
    linkedIn: string
    email: string
    companyName: string
    position: string
    linkedInConnectDate: string
}

export const readLinkedInConnections = (): LinkedInConnection[] => {
    const csv = fs.readFileSync('./connections.csv', 'utf-8')
    const connections = parseCSV(csv).map((c) => ({
        firstName: c['First Name'],
        lastName: c['Last Name'],
        linkedIn: c['URL'],
        email: c['Email Address'],
        companyName: c['Company'],
        position: c['Position'],
        linkedInConnectDate: linkedInDate2HubSpotDate(c['Connected On']),
    }))
    return connections
}

export const writeLinkedInConnections = (connections: LinkedInConnection[]) => {
    const data = connections.map((connection) => ({
        'First Name': connection.firstName,
        'Last Name': connection.lastName,
        URL: connection.linkedIn,
        'Email Address': connection.email,
        Company: connection.companyName,
        Position: connection.position,
        'Connected On': hubSpotDate2LinkedInDate(
            connection.linkedInConnectDate,
        ),
    }))
    const csv = createCSV(
        [
            'First Name',
            'Last Name',
            'URL',
            'Email Address',
            'Company',
            'Position',
            'Connected On',
        ],
        data,
    )
    fs.writeFileSync('./connections.csv', csv, { encoding: 'utf-8' })
}
