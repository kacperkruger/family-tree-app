export interface PersonRequest {
    id: string,
    name: string,
    surname: string,
    gender: string,
    dateOfBirth: string,
    parents: string[],
    partners: string[]
}

export interface Person {
    id: string,
    name: string,
    surname: string,
    gender: string,
    dateOfBirth: string,
    mid: string,
    fid: string,
    pids: string[]
}