export interface IUser {
    // не уникальный, может меняться из-за сортировки
    row_id: number;
    ФИО: string;
    Телефон: string;
    'Дата рождения': string;
    'Статус/Звание': string;
    Город: string;
    Учителя: string;
    'Вегетарианское питание': string;
    'Участие в концерте': string;
    'На машине': string;
    Пожелания: string;
    'Дата регистрации': string;
    'Дата оплаты': string;
    'Сумма оплаты': string;
    'Количество оплат': string;
    Координатор: string;
    'Доп питание': string;
    'Формат номера': string;
    'Будет видео?': string;
    'Длительность номера': string;
    'Тема номера': string;
    'Описание номера': string;
    'Общая сумма': string;
    'Время прибытия на станцию': string;
    'Информация по машине': string;
    // не уникальынй, потому что может зарегаться несколько человек с одного телефона
    user_id: string;
    Корпус?: string;
    Этаж?: string;
    Комната?: string;
}
