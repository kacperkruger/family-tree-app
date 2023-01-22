type Gender = 'MALE' | 'FEMALE'

export interface PersonRequest {
    name: string,
    surname?: string,
    gender?: Gender,
    dateOfBirth?: Date
}