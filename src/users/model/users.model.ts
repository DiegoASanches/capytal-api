export interface UserModel {
    _id?: string,
    username: string,
    password: string,
    transactionId: string,
    email: string,
    hasPassword: boolean,
    enable: boolean,
    phone: string,
    emailValidation: boolean,
    phoneValidation: boolean,
    createdAt: Date,
    updatedAt: Date
};
