import axios from 'axios'

interface Contact {
    email?: string
    firstName?: string
    lastName?: string
    companyName?: string
}

export const enrichContact = async (contact: Contact) => {
    const url = 'https://api.apollo.io/v1/people/match'
    const headers = {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
    }
    const data = {
        api_key: process.env.APOLLO_API_KEY,
        email: contact.email,
        first_name: contact.firstName,
        last_name: contact.lastName,
        organization_name: contact.companyName,
        reveal_personal_emails: true,
    }
    const res = await axios.post(url, data, { headers })
    return res.data
}

export const enrichContactsBulk = async (contacts: Contact[]) => {
    const url = 'https://api.apollo.io/v1/people/bulk_match'
    const headers = {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
    }
    const data = {
        api_key: process.env.APOLLO_API_KEY,
        details: contacts.map((contact) => ({
            email: contact.email,
            first_name: contact.firstName,
            last_name: contact.lastName,
            organization_name: contact.companyName,
        })),
        reveal_personal_emails: true,
    }
    const res = await axios.post(url, data, { headers })
    return res.data.matches
}
