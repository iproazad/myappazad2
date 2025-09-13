
export interface Person {
    id: string;
    photo?: string; // base64 data URL
    personType: string;
    fullName: string;
    birthYear: string;
    address: string;
    phone: string;
    maritalStatus: string;
    occupation: string;
    imprisonment: string;
    idNumber: string;
}

export interface CaseDetails {
    issueType: string;
    timeFrom: string;
    timeTo: string;
    period: string;
    problemLocation: string;
    driverName: string;
    point: string;
    sentTo: string;
    notes: string;
}

export interface Record {
    id: string;
    createdAt: string;
    persons: Person[];
    caseDetails: CaseDetails;
    cardImage: string; // base64 data URL
}
