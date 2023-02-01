export interface PersonResponse {
  id: string;
  name: string;
  surname: string;
  gender: string;
  dateOfBirth: string;
  parents: string[];
  partners: string[];
}

export interface Person {
  id: string;
  name: string;
  surname: string;
  gender: string;
  dateOfBirth: string;
  mid?: string;
  fid?: string;
  pids: string[];
}

export interface PersonRequest {
  name: string;
  surname: string | null;
  gender: string | null;
  dateOfBirth: string | null;
}
