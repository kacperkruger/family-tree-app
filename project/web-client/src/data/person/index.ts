export interface PersonResponse {
  id: string;
  name: string;
  surname: string;
  gender: string;
  dateOfBirth: string;
  parents: string[];
  partners: string[];
  optionalParents: string[];
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
  parents: string[];
  optionalParents: string[];
}

export interface PersonRequest {
  name: string;
  surname: string | null;
  gender: string | null;
  dateOfBirth: string | null;
}

export interface PersonEditRequest {
  name: string;
  surname: string;
  gender: string;
  dateOfBirth: string;
  parents: string[];
  partners: string[];
  optionalParents: string[];
}
