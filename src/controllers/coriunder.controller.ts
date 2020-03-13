import * as axios from 'axios';
import CryptoJS from 'crypto-js';
import { ResponseStatus } from '../utils/consts';
import { Query } from 'mongoose';

export module CoriunderRequests {
    const applicationToken: string = 'a5241acd-df32-44ae-a373-590e52c9c78a';
    const serverURL: string = 'https://webservices.coriunder.cloud';
    const hash: string = '1Wx6uC3Y';

    const defaultHeaders = { "Content-Type": "application/json", applicationToken }

    // export async function accountAdd(requestData: { AccountId?: number, Currency?: string }): Promise<any> {
    //     try {
    //         const res: axios.AxiosResponse = await axios.default.post(
    //             `${ serverURL }/AccountAdd`, requestData, { headers: defaultHeaders });

    //         console.log(res);
    //     } catch(ex) {
    //         console.error(ex);
    //     }
    // }
    // export async function cardActivate(requestData: CardActivateData): Promise<any> {
    //     try {
    //         const res: axios.AxiosResponse = await axios.default.post(
    //             `${ serverURL }/ActivateCard`, requestData, { headers: defaultHeaders });
            
    //         console.log(res);
    //     } catch(ex) {
    //         console.error(ex);
    //     }
    // }

    // export async function cardActivateV2(requestData: { requestParams?: PrePaidRP }): Promise<any> {
    //     try {
    //         const res: axios.AxiosResponse= await axios.default.post(
    //             `${ serverURL }/ActivateCardV2`,requestData,{ headers:defaultHeaders});

    //         console.log(res);
    //     } catch(ex) {
    //         console.error(ex);
    //     }

    // }

    // export async function AssignUser(requestData: { AccountId?: Long ,AccountNum?:string}): Promise<any> {
    //     try {
    //         const res: axios.AxiosResponse= await axios.default.post(
    //             `${ serverURL }/AssignUser`,requestData,{ headers:defaultHeaders});

    //         console.log(res);
    //     } catch(ex) {
    //         console.error(ex);
    //     }

    // }
    // export async function Balance(requestData: { AccountId?: Long ,pin?:string}): Promise<any> {
    //     try {
    //         const res: axios.AxiosResponse= await axios.default.post(
    //             `${ serverURL }/Balance`,requestData,{ headers:defaultHeaders});

    //         console.log(res);
    //     } catch(ex) {
    //         console.error(ex);
    //     }

    // }
    // export async function BlockCard(requestData: { AccountId?: Long ,PIN?:string}): Promise<any> {
    //     try {
    //         const res: axios.AxiosResponse= await axios.default.post(
    //             `${ serverURL }/BlockCard`,requestData,{ headers:defaultHeaders});

    //         console.log(res);
    //     } catch(ex) {
    //         console.error(ex);
    //     }

    // }
    // export async function CardDebitRequest(requestData: { requestParams?: PrePaidRP }): Promise<any> {
    //     try {
    //         const res: axios.AxiosResponse= await axios.default.post(
    //             `${ serverURL }/CardDebitRequest`,requestData,{ headers:defaultHeaders});

    //         console.log(res);
    //     } catch(ex) {
    //         console.error(ex);
    //     }

    // }

    // export async function CardInfo(requestData: { AccountId?: Long }): Promise<any> {
    //     try {
    //         const res: axios.AxiosResponse= await axios.default.post(
    //             `${ serverURL }/CardInfo`,requestData,{ headers:defaultHeaders});

    //         console.log(res);
    //     } catch(ex) {
    //         console.error(ex);
    //     }

    // }
    // export async function CardIssueRequestV2(requestData: { requestParams?: PrePaidRP }): Promise<any> {
    //     try {
    //         const res: axios.AxiosResponse= await axios.default.post(
    //             `${ serverURL }/CardIssueRequestV2`,requestData,{ headers:defaultHeaders});

    //         console.log(res);
    //     } catch(ex) {
    //         console.error(ex);
    //     }

    // }
    // export async function CardIssueRequestWithDelvAddress(requestData: { requestParams?: PrePaidRP }): Promise<any> {
    //     try {
    //         const res: axios.AxiosResponse= await axios.default.post(
    //             `${ serverURL }/CardIssueRequestWithDelvAddress`,requestData,{ headers:defaultHeaders});

    //         console.log(res);
    //     } catch(ex) {
    //         console.error(ex);
    //     }

    // }
    // export async function CardPIN(requestData: { AccountId?: Long , ValidThru?:string , SecurityCode?:string , PIN?:string }): Promise<any> {
    //     try {
    //         const res: axios.AxiosResponse= await axios.default.post(
    //             `${ serverURL }/CardIssueRequestWithDelvAddress`,requestData,{ headers:defaultHeaders});

    //         console.log(res);
    //     } catch(ex) {
    //         console.error(ex);
    //     }

    // }

    export async function login(data: { email: string, password: string }): Promise<CoriunderCred> {
        const res: axios.AxiosResponse = await axios.default.post(`${serverURL}/v2/account.svc/Login`, {
            email: data.email,
            password: data.password,
            options: { applicationToken, userRole: UserRole.Customer }
        },
        { headers: defaultHeaders });

        if(res.status === 200) {
            const resData: { d: CoriunderLoginRes } = res.data;
            const credHeaderName: string = resData.d.CredentialsHeaderName;
            const credToken: string = resData.d.CredentialsToken;

            return {
                CredentialsToken: credToken,
                CredentialsHeaderName: credHeaderName,
                id: resData.d.Number
            }
        }

        return null;
    }

    function createSignature(body: any): string {
        const stringifiedBody: string = Object.keys(body).length === 0 ? '' : JSON.stringify(body);
        const cryptoData: CryptoJS.WordArray = CryptoJS.SHA256(body + hash);
        
        return CryptoJS.enc.Base64.stringify(cryptoData);
    }

    export async function GetCustomer(cred: CoriunderCred): Promise<CoriunderCustomer> {
        const reqBody = "{}";
        const signature: string = createSignature(reqBody);

        try {
            const res: axios.AxiosResponse = await axios.default.post(
                `${serverURL}/V2/customer.svc/GetCustomer`,
                reqBody, { 
                    headers: {
                        ...defaultHeaders, Signature: `bytes-SHA256, ${signature}`, 
                        [cred.CredentialsHeaderName]: cred.CredentialsToken
                    }
            });
            if(res.status === ResponseStatus.Ok) {
                const resData: { d: CoriunderCustomer } = res.data;
                return resData.d;
            }
        } catch(ex) {
            console.log(ex);
        }
        return null;
    } 

    export async function GetBalance(cred: CoriunderCred): Promise<CoriunderCustomer> {
        const reqBody = "{}";
        const signature: string = createSignature(reqBody);

        try {
            const res: axios.AxiosResponse = await axios.default.post(
                `${serverURL}/V2/Balance.svc/GetTotal`,
                    reqBody, { 
                    headers: {
                        ...defaultHeaders, Signature: `bytes-SHA256, ${signature}`, 
                        [cred.CredentialsHeaderName]: cred.CredentialsToken
                    }
            });
            if(res.status === ResponseStatus.Ok) {
                return res.data;
            }
        } catch(ex) {
            console.log(ex);
        }
        return null;
    }

    export async function TransferAmount(
        cred: CoriunderCred, 
        destAccountId: number, 
        amount: number, 
        pinCode: string, 
        currencyIso: string, 
        text: string
    ): Promise<CoriunderCustomer> {
        const reqBody = 
        `{ "destAccountId": "${destAccountId}", "amount": "${amount}", "pinCode": "${pinCode}", "currencyIso": "${currencyIso}", "text":"${text}" }`;
        const signature: string = createSignature(reqBody);

        try {
            const res: axios.AxiosResponse = await axios.default.post(
                `${serverURL}/V2/Balance.svc/TransferAmount`,
                    reqBody, { 
                    headers: {
                        ...defaultHeaders, Signature: `bytes-SHA256, ${signature}`, 
                        [cred.CredentialsHeaderName]: cred.CredentialsToken
                    }
            });

            if(res.status === ResponseStatus.Ok) {
                return res.data;
            }
        } catch(ex) {
            console.log(ex);
        }
        
        return null;
    }
    
    export async function GetManagedAccounts(cred: CoriunderCred) {
        const reqBody = "{}";
        const signature: string = createSignature(reqBody);

        try {
            const res: axios.AxiosResponse = await axios.default.post(
                `${serverURL}/V2/Customer.svc/GetManagedAccounts`,
                reqBody, { 
                    headers: {
                        ...defaultHeaders, Signature: `bytes-SHA256, ${signature}`, 
                        [cred.CredentialsHeaderName]: cred.CredentialsToken
                    }
            });
            if(res.status === ResponseStatus.Ok) {
                const resData: { d: CoriunderCustomer } = res.data;
                return resData.d;
            }
        } catch(ex) {
            console.log(ex);
        }
        return null;
    }

    /**
     * @description Creates new customer by Coriunder api
     * @param registerData register data of the customer
     * @returns ID of new Customer
     */
    export async function RegisterCustomer(registerData: CoriunderRegistrationModel): Promise<number> {
        const reqBody = {
            data: {
                ApplicationToken: applicationToken,
                Password: registerData.data.password,
                PinCode: registerData.data.pinCode,
                info: {
                    AddressLine1: registerData.info.addressLine,
                    City: registerData.info.city,
                    CountryIso: registerData.info.country,
                    PostalCode: registerData.info.postalCode,
                    EmailAddress: registerData.info.email, 
                    FirstName: registerData.info.firstname,
                    LastName: registerData.info.lastname
                }
            }
        }

        try {
            const res: axios.AxiosResponse = await axios.default.post(
                `${serverURL}/V2/customer.svc/RegisterCustomer`,
                reqBody,
                { headers: defaultHeaders }
            );
            
            if(res.status === ResponseStatus.Ok) {
                const resData: { d: CustomerRegistrationResponse } = res.data;
                if(resData.d.IsSuccess) {
                    return resData.d.Number;
                }
                throw `Operation failed, ${resData.d.Message}`;
            }
        } catch(ex) {
            throw ex;
        }
    }
}

enum UserRole {
    Customer = 15,
    Merchant = 20,
    Affiliate = 25
}

interface CustomerRegistrationResponse {
    __type: string;
    Code: number;
    IsSuccess: boolean;
    Key: string;
    Message: string;
    Number: number; // ID of the new customer
}

interface CoriunderRegistrationModel {
    data: {
        applicationToken?: string;
        password: string;
        pinCode: string;
    },
    info: {
        email: string,
        firstname: string;
        lastname: string;
        addressLine: string;
        city: string;
        country: string;
        postalCode: string;
    }
}

export interface CoriunderCred { 
    CredentialsToken: string;
    CredentialsHeaderName: string; 
    id: string; 
}

interface CoriunderLoginRes {
    __type: string;
    Code: number;
    CredentialsHeaderName: string;
    CredentialsToken: string;
    EncodedCookie: string;
    IsDeviceActivated: boolean;
    IsDeviceBlocked: boolean;
    IsDeviceRegistered: boolean;
    IsDeviceRegistrationRequired: boolean;
    IsFirstLogin: boolean;
    IsSuccess: boolean;
    Key: string;
    LastLogin: string; // Need to parse to date
    Message: string;
    Number: string;
    VersionUpdateRequired: boolean
}

interface CoriunderCustomer {
    __type: string;
    AddressLine1: string;
    AddressLine2: string;
    City: string,
    CountryIso: string,
    PostalCode: string,
    StateIso: string,
    AboutMe: string,
    ActiveStatus: string,
    CellNumber: string,
    CustomerNumber: string,
    DateOfBirth: Date,
    Education: string,
    EmailAddress: string,
    ExtendedDetails: any,
    FirstName: string,
    Gender: any,
    GroupID: string,
    Industry: string,
    Interests: any[],
    IsAgreePolicy: boolean,
    IsAgreeTerms: boolean,
    KYCLevel: number,
    LastName: string,
    MaritalStatus: string,
    PersonalNumber: string,
    PhoneNumber: string,
    ProfileImage: string,
    ProfileImageSize: number,
    RegistrationDate: string,
    SignificantOther: any,
    Skills: any[],
    UserName?: string
}