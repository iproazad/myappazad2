
export interface Suspect {
  id: string;
  photo: string | null;
  name: string;
  birthdate: string;
  address: string;
  problemType: string;
  maritalStatus: string;
  job: string;
  prison: string;
  phone: string;
  timeFrom: string;
  timeTo: string;
  period: string;
  problemLocation: string;
  driverName: string;
  point: string;
  sentTo: string;
  date: string; // ISO string for registration date/time
}

export interface Person {
  id: string;
  photo: string | null;
  type: 'مشتەكی' | 'تاوانبار' | ''; // Complainant or Accused
  name: string;
  birthdate: string;
  address: string;
  phone: string;
}

export interface CaseInfo {
  issueType: string;
  timeFrom: string;
  timeTo: string;
  period: string;
  location: string;
  driverName: string;
  point: string;
  sentTo: string;
}

export interface Incident {
  id: string;
  caseInfo: CaseInfo;
  persons: Person[];
  date: string; // ISO string for registration date/time
}
