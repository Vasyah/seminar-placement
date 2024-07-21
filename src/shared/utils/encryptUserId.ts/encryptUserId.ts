


export type EncryptedId = string
export class Encrypter {

    //зашифровать id
    static encodeId(user_id: string, ФИО: string): EncryptedId {
        return `[${user_id}]${ФИО}`


    }
// расшифровать id
    static decodeId(encryptedId: EncryptedId): number {
        const regeExp = /\d+/ // найти все числа

        return Number(regeExp.exec(encryptedId)?.[0]) ?? 0
    }
}
