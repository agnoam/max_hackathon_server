export enum ResponseStatus {
    NoContent = 204,
    NotFound = 404,
    BadRequest = 400,
    Unauthorized = 401,
    InternalError = 500,
    NotImplemented = 501,
    Ok = 200,
    Created = 201,
    Accepted = 202,
    Found = 302
}

export enum CollectionsNames {
    Users = 'users',
    Transactions = 'transactions',
    Accounts = 'accounts'
}

export enum Category {
    Transaction = 'Transaction',
    Technology = 'Technology',
    Vacation = 'Vacation',
    Resturant = 'Resturants'
}