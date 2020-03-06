import * as soap from 'soap';
import * as axios from 'axios';
import * as http from 'http';

export module MaxRequests {
    const token: string = '';
    const serverURL: string = 'https://webservices.coriunder.cloud/v2/Prepaid.svc';

    const defaultHeaders = {
        "Content-Type": "application/json",
        "applicationToken": token
    }

    export async function accountAdd(requestData: { AccountId?: number, Currency?: string }) {
        try {
            const res: axios.AxiosResponse = await axios.default.post(
                `${ serverURL }/AccountAdd`, requestData, { headers: defaultHeaders });

            console.log(res);
        } catch(ex) {
            console.error(ex);
        }
    }

    export async function cardActivate(requestData: { AccountId?: Long, ValidThru?: string, SecurityCode?: string }): Promise<any>{
        const url: string = 'https://webservices.coriunder.cloud/v2/Prepaid.svc';
        await soap.createClientAsync(url, {
            forceSoap12Headers: true
        });
    }

    export async function cardActivateV2(requestData: { requestParams?: PrePaidRP }): Promise<any> {
        
    }
}

interface PrePaidRP{
    null: null
}