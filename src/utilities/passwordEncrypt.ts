import bcrypt from "bcrypt"


export const passwordEncrypt = async (password: string): Promise<string>=>{
    const saltRounds = 10
    let passwordEncrypted = bcrypt.hash(password, saltRounds)
    return await passwordEncrypted
}


export const comparePasswordHash = async (password: string, hash: string): Promise<boolean>=>{
    return await bcrypt.compare(password, hash)
     
}
