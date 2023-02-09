export interface UpdatePersonRequest {
    name: string,
    surname: string,
    gender: string,
    dateOfBirth: string,
    parents: string[],
    partners: string[],
    optionalParents: string[]
}