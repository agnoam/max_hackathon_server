import * as axios from 'axios';

export module MaxRequests {
    const token: string = '';
    const serverURL: string = 'https://webservices.coriunder.cloud/v2/Prepaid.svc';

    const defaultHeaders = {
        "Content-Type": "application/json",
        "applicationToken": token
    }

    export async function accountAdd(requestData: { AccountId?: number, Currency?: string }): Promise<any> {
        try {
            const res: axios.AxiosResponse = await axios.default.post(
                `${ serverURL }/AccountAdd`, requestData, { headers: defaultHeaders });

            console.log(res);
        } catch(ex) {
            console.error(ex);
        }
    }
    export async function cardActivate(requestData: CardActivateData): Promise<any> {
        try {
            const res: axios.AxiosResponse = await axios.default.post(
                `${ serverURL }/ActivateCard`, requestData, { headers: defaultHeaders });
            
            console.log(res);
        } catch(ex) {
            console.error(ex);
        }
    }

    export async function cardActivateV2(requestData: { requestParams?: PrePaidRP }): Promise<any> {
        try {
            const res: axios.AxiosResponse= await axios.default.post(
                `${ serverURL }/ActivateCardV2`,requestData,{ headers:defaultHeaders});

            console.log(res);
        } catch(ex) {
            console.error(ex);
        }

    }

    export async function AssignUser(requestData: { AccountId?: Long ,AccountNum?:string}): Promise<any> {
        try {
            const res: axios.AxiosResponse= await axios.default.post(
                `${ serverURL }/AssignUser`,requestData,{ headers:defaultHeaders});

            console.log(res);
        } catch(ex) {
            console.error(ex);
        }

    }
    export async function Balance(requestData: { AccountId?: Long ,pin?:string}): Promise<any> {
        try {
            const res: axios.AxiosResponse= await axios.default.post(
                `${ serverURL }/Balance`,requestData,{ headers:defaultHeaders});

            console.log(res);
        } catch(ex) {
            console.error(ex);
        }

    }
    export async function BlockCard(requestData: { AccountId?: Long ,PIN?:string}): Promise<any> {
        try {
            const res: axios.AxiosResponse= await axios.default.post(
                `${ serverURL }/BlockCard`,requestData,{ headers:defaultHeaders});

            console.log(res);
        } catch(ex) {
            console.error(ex);
        }

    }
    export async function CardDebitRequest(requestData: { requestParams?: PrePaidRP }): Promise<any> {
        try {
            const res: axios.AxiosResponse= await axios.default.post(
                `${ serverURL }/CardDebitRequest`,requestData,{ headers:defaultHeaders});

            console.log(res);
        } catch(ex) {
            console.error(ex);
        }

    }

    export async function CardInfo(requestData: { AccountId?: Long }): Promise<any> {
        try {
            const res: axios.AxiosResponse= await axios.default.post(
                `${ serverURL }/CardInfo`,requestData,{ headers:defaultHeaders});

            console.log(res);
        } catch(ex) {
            console.error(ex);
        }

    }
    export async function CardIssueRequestV2(requestData: { requestParams?: PrePaidRP }): Promise<any> {
        try {
            const res: axios.AxiosResponse= await axios.default.post(
                `${ serverURL }/CardIssueRequestV2`,requestData,{ headers:defaultHeaders});

            console.log(res);
        } catch(ex) {
            console.error(ex);
        }

    }
    export async function CardIssueRequestWithDelvAddress(requestData: { requestParams?: PrePaidRP }): Promise<any> {
        try {
            const res: axios.AxiosResponse= await axios.default.post(
                `${ serverURL }/CardIssueRequestWithDelvAddress`,requestData,{ headers:defaultHeaders});

            console.log(res);
        } catch(ex) {
            console.error(ex);
        }

    }
    export async function CardPIN(requestData: { AccountId?: Long , ValidThru?:string , SecurityCode?:string , PIN?:string }): Promise<any> {
        try {
            const res: axios.AxiosResponse= await axios.default.post(
                `${ serverURL }/CardIssueRequestWithDelvAddress`,requestData,{ headers:defaultHeaders});

            console.log(res);
        } catch(ex) {
            console.error(ex);
        }

    }

}

interface CardActivateData {
    AccountId?: number;
    ValidThru?: string; 
    SecurityCode?: string;
}

interface PrePaidRP {
    null: null
}