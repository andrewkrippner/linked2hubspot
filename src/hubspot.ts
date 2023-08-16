import { Client } from '@hubspot/api-client'
import { LinkedInConnection } from './types'

export const getHubspotClient = (accessToken: string) =>
    new Client({
        accessToken,
    })

export const getHubspotContactId = async (
    hubspotClient: Client,
    email: string
) => {
    try {
        const { id } = await hubspotClient.crm.contacts.basicApi.getById(
            email,
            undefined,
            undefined,
            undefined,
            false,
            'email'
        )
        return id
    } catch {
        return undefined
    }
}

export const createHubspotDeal = (
    hubspotClient: Client,
    dealName: string,
    dealStage: string,
    associatedContactId: string
) =>
    hubspotClient.crm.deals.basicApi.create({
        properties: {
            pipeline: 'default',
            dealstage: dealStage,
            dealname: dealName,
            lead_source: 'LinkedIn',
        },
        associations: [
            {
                to: { id: associatedContactId },
                types: [
                    {
                        associationCategory: 'HUBSPOT_DEFINED',
                        associationTypeId: 3,
                    },
                ],
            },
        ],
    })

export const syncHubspotContact = async (
    hubspotClient: Client,
    linkedInConnection: LinkedInConnection,
    dealStage?: string
) => {
    const contactId = await getHubspotContactId(
        hubspotClient,
        linkedInConnection.email
    )
    if (contactId) {
        await hubspotClient.crm.contacts.basicApi.update(contactId, {
            properties: {
                linkedin: linkedInConnection.linkedIn,
                jobtitle: linkedInConnection.position,
                linkedinconnectiondate: linkedInConnection.linkedInConnectDate,
            },
        })
    } else {
        const newContact = await hubspotClient.crm.contacts.basicApi.create({
            properties: {
                email: linkedInConnection.email,
                firstname: linkedInConnection.firstName,
                lastname: linkedInConnection.lastName,
                linkedin: linkedInConnection.linkedIn,
                jobtitle: linkedInConnection.position,
                linkedinconnectiondate: linkedInConnection.linkedInConnectDate,
                leadsource: 'Linked In',
            },
            associations: [],
        })
        if (dealStage) {
            await createHubspotDeal(
                hubspotClient,
                `${linkedInConnection.firstName} ${linkedInConnection.lastName}`,
                dealStage,
                newContact.id
            )
        }
    }
}
