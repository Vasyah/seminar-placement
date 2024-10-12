export type EncryptedId = string;
export class Encrypter {
    //зашифровать id
    static encodeId(user_id: string, ФИО: string): EncryptedId {
        return `${user_id}||${ФИО}`;
    }
    // расшифровать id
    static decodeId(encryptedId: EncryptedId): { id: number; ФИО: string } {
        const parts = encryptedId?.split('||');
        return { id: Number(parts?.[0]) ?? 0, ФИО: parts?.[1] ?? '' };
    }
}
