/**
 * Dto is the Data Transport Object 
 * it will bes user as transport data layer between 
 * the controller --> the useCase --> the repository 
 */

export interface ICreateUserDto {
    username?: string,
    email?: string,
    phone?: string,
    firstname: string,
    lastname: string,

    state: string,
    city: string,
    local: string,
    zip: number,

    password: string
}