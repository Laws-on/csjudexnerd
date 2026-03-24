export interface RegistrationData {
  // Stage 1 - handled by auth
  email: string;
  password: string;

  // Stage 2 - Personal Info
  fullName: string;
  phoneNumber: string;
  sex: string;
  dateOfBirth: string;
  maritalStatus: string;
  nin: string;
  nationality: string;
  stateOfOrigin: string;
  localGovernment: string;
  townCity: string;
  residentialAddress: string;

  // Stage 3 - Next of Kin
  nokName: string;
  nokPhone: string;
  nokEmail: string;

  // Stage 4 - Academic Data
  institution: string;
  faculty: string;
  department: string;
  programmeCategory: string;
  programmeType: string;
  matriculationNumber: string;

  // Stage 5 - HOD & Supervisor
  hodTitle: string;
  hodFullName: string;
  hodPhone: string;
  hodEmail: string;
  supervisorTitle: string;
  supervisorFullName: string;
  supervisorPhone: string;
  supervisorEmail: string;

  // Stage 6 - Documents (file references)
  certificationPage: File | null;
  projectFiles: File[];
  projectTitle: string;
  passportPhoto: File | null;
  ninDocument: File | null;
  ninDocumentType: string;
  authorizationLetter: File | null;

  // Stage 7 - Payment
  paymentReceipt: File | null;
}

export const initialRegistrationData: RegistrationData = {
  email: '',
  password: '',
  fullName: '',
  phoneNumber: '',
  sex: '',
  dateOfBirth: '',
  maritalStatus: '',
  nin: '',
  nationality: '',
  stateOfOrigin: '',
  localGovernment: '',
  townCity: '',
  residentialAddress: '',
  nokName: '',
  nokPhone: '',
  nokEmail: '',
  institution: '',
  faculty: '',
  department: '',
  programmeCategory: '',
  programmeType: '',
  matriculationNumber: '',
  hodTitle: '',
  hodFullName: '',
  hodPhone: '',
  hodEmail: '',
  supervisorTitle: '',
  supervisorFullName: '',
  supervisorPhone: '',
  supervisorEmail: '',
  certificationPage: null,
  projectFiles: [],
  projectTitle: '',
  passportPhoto: null,
  ninDocument: null,
  ninDocumentType: '',
  authorizationLetter: null,
  paymentReceipt: null,
};
