import * as soap from 'soap';

export module MaxRequests {
    export async function addAccount(requestData: { AccountId?: Long, Currency?: string }): Promise<any> {
        const url: string = 'https://webservices.coriunder.cloud/v2/Prepaid.svc';
        await soap.createClientAsync(url, {
            forceSoap12Headers: true
        });
    }
}