export const DEFAULT_LANG = "en";

export const dict = Object.freeze({
    uz: Object.freeze({
        // Auth / Foydalanuvchi
        UNAUTHORIZED: "Ruxsat yo‘q",
        NOT_ADMIN: "Siz administrator emassiz",
        INVALID_TOKEN: "Noto‘g‘ri token",
        INVALID_OR_EXPIRED_TOKEN: "Noto‘g‘ri yoki muddati o‘tgan token",
        INVALID_CREDENTIALS: "Noto‘g‘ri login yoki parol",
        USERNAME_AND_PASSWORD_REQUIRED: "Username va parol kiritilishi shart",
        USER_NOT_FOUND: "Foydalanuvchi topilmadi",
        USERNAME_EXISTS: "Bunday username allaqachon mavjud",
        USER_ALREADY_EXISTS: "Foydalanuvchi allaqachon ro‘yxatdan o‘tgan",
        USER_REGISTERED_SUCCESSFULLY: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi",
        LOGIN_SUCCESSFUL: "Muvaffaqiyatli kirish amalga oshirildi",

        // Parol o‘zgartirish
        OLD_AND_NEW_PASSWORD_REQUIRED: "Eski va yangi parol kiritilishi shart",
        OLD_PASSWORD_INCORRECT: "Eski parol noto‘g‘ri",
        INVALID_NEW_PASSWORD: "Yangi parol talablarga mos kelmaydi",
        PASSWORD_UPDATED: "Parol muvaffaqiyatli yangilandi",
        PASSWORDS_DO_NOT_MATCH: "Yangi parollar bir-biriga mos kelmaydi",

        // Playlist
        PLAYLIST_NAME_REQUIRED: "Playlist nomi kiritilishi shart",
        PLAYLIST_DESCRIPTION_TOO_LONG: "Playlist tavsifi juda uzun (maksimal 500 ta belgi)",
        PLAYLIST_INDEX_MUST_BE_INTEGER: "Playlist tartib raqami butun son bo‘lishi kerak",
        PLAYLIST_NOT_FOUND: "Playlist topilmadi",
        PLAYLIST_ALREADY_EXISTS: "Bunday nomli playlist allaqachon mavjud",
        PLAYLIST_CREATED_SUCCESSFULLY: "Playlist muvaffaqiyatli yaratildi",
        PLAYLIST_UPDATED_SUCCESSFULLY: "Playlist muvaffaqiyatli yangilandi",
        PLAYLIST_DELETED_SUCCESSFULLY: "Playlist muvaffaqiyatli o‘chirildi",

        // Track / Qo‘shiq
        TRACK_ID_REQUIRED: "trackId kiritilishi shart",
        TRACK_NOT_FOUND: "Qo‘shiq topilmadi",
        TRACK_ALREADY_IN_PLAYLIST: "Bu qo‘shiq allaqachon playlistda mavjud",
        TRACK_ADDED_TO_PLAYLIST: "Qo‘shiq playlistga qo‘shildi",
        TRACK_REMOVED_FROM_PLAYLIST: "Qo‘shiq playlistdan olib tashlandi",
        INVALID_TRACK_URL: "Qo‘shiq havolasi noto‘g‘ri",
        TRACK_UPLOAD_FAILED: "Qo‘shiq yuklab bo‘lmadi",

        // Fayl / Upload
        INVALID_FILE_TYPE: "Noto‘g‘ri fayl formati",
        FILE_TOO_LARGE: "Fayl hajmi juda katta (maksimal 50 MB)",
        FILE_REQUIRED: "Fayl yuklanishi shart",
        INVALID_IMAGE_TYPE: "Faqat rasm fayllari qabul qilinadi (jpg, png, webp)",

        // Umumiy / Tizim
        SERVER_ERROR: "Serverda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko‘ring",
        INVALID_LANGUAGE: "Noto‘g‘ri til kodi",
        INVALID_REQUEST: "So‘rov noto‘g‘ri shaklda yuborildi",
        REQUIRED_FIELD_MISSING: "Majburiy maydon to‘ldirilmagan",
        ROUTER_404: "Bunday API manzili mavjud emas",
        METHOD_NOT_ALLOWED: "Bu usul (method) ushbu manzilda qo‘llab-quvvatlanmaydi",

        // Qo‘shimcha tez-tez ishlatiladigan xabarlar
        SUCCESS: "Muvaffaqiyatli bajarildi",
        NO_DATA_FOUND: "Hech qanday ma'lumot topilmadi",
        ACCESS_DENIED: "Kirish taqiqlangan",
        TOKEN_EXPIRED: "Token muddati tugagan, qayta kirish kerak",
        RATE_LIMIT_EXCEEDED: "So‘rovlar soni chegaradan oshib ketdi. Birozdan keyin qayta urinib ko‘ring",
    }),

    ru: Object.freeze({
        UNAUTHORIZED: "Нет доступа",
        NOT_ADMIN: "Вы не администратор",
        INVALID_TOKEN: "Неверный токен",
        INVALID_OR_EXPIRED_TOKEN: "Неверный или просроченный токен",
        INVALID_CREDENTIALS: "Неверный логин или пароль",
        USERNAME_AND_PASSWORD_REQUIRED: "Требуется имя пользователя и пароль",
        USER_NOT_FOUND: "Пользователь не найден",
        USERNAME_EXISTS: "Такое имя пользователя уже существует",
        USER_ALREADY_EXISTS: "Пользователь уже зарегистрирован",
        USER_REGISTERED_SUCCESSFULLY: "Пользователь успешно зарегистрирован",
        LOGIN_SUCCESSFUL: "Успешный вход",

        OLD_AND_NEW_PASSWORD_REQUIRED: "Требуется старый и новый пароль",
        OLD_PASSWORD_INCORRECT: "Старый пароль неверный",
        INVALID_NEW_PASSWORD: "Новый пароль не соответствует требованиям",
        PASSWORD_UPDATED: "Пароль успешно изменён",

        PLAYLIST_NAME_REQUIRED: "Требуется название плейлиста",
        PLAYLIST_NOT_FOUND: "Плейлист не найден",
        PLAYLIST_CREATED_SUCCESSFULLY: "Плейлист успешно создан",

        TRACK_ID_REQUIRED: "Требуется ID трека",
        TRACK_NOT_FOUND: "Трек не найден",
        TRACK_ADDED_TO_PLAYLIST: "Трек добавлен в плейлист",

        INVALID_FILE_TYPE: "Неверный тип файла",
        FILE_TOO_LARGE: "Файл слишком большой",
        SERVER_ERROR: "Ошибка сервера. Попробуйте позже",
        ROUTER_404: "Такой API не существует",
    }),

    en: Object.freeze({
        UNAUTHORIZED: "Unauthorized",
        NOT_ADMIN: "You are not an admin",
        INVALID_TOKEN: "Invalid token",
        INVALID_OR_EXPIRED_TOKEN: "Invalid or expired token",
        INVALID_CREDENTIALS: "Invalid username or password",
        USERNAME_AND_PASSWORD_REQUIRED: "Username and password are required",
        USER_NOT_FOUND: "User not found",
        USERNAME_EXISTS: "Username already exists",
        USER_ALREADY_EXISTS: "User already exists",
        USER_REGISTERED_SUCCESSFULLY: "User registered successfully",
        LOGIN_SUCCESSFUL: "Login successful",

        OLD_AND_NEW_PASSWORD_REQUIRED: "Old and new password are required",
        OLD_PASSWORD_INCORRECT: "Old password is incorrect",
        INVALID_NEW_PASSWORD: "New password is invalid",
        PASSWORD_UPDATED: "Password updated successfully",

        PLAYLIST_NAME_REQUIRED: "Playlist name is required",
        PLAYLIST_NOT_FOUND: "Playlist not found",
        PLAYLIST_CREATED_SUCCESSFULLY: "Playlist created successfully",

        TRACK_ID_REQUIRED: "Track ID is required",
        TRACK_NOT_FOUND: "Track not found",
        TRACK_ADDED_TO_PLAYLIST: "Track added to playlist",

        INVALID_FILE_TYPE: "Invalid file type",
        FILE_TOO_LARGE: "File is too large",
        SERVER_ERROR: "Server error. Please try again later",
        ROUTER_404: "API endpoint not found",
    }),
});

/**
 * @param {string} lang - til kodi ("uz", "ru", "en")
 * @param {string} key - kalit (masalan: "INVALID_TOKEN")
 * @returns {string} - mos keluvchi xabar
 */
export function t(lang, key) {
    const language = dict[lang] ? lang : DEFAULT_LANG;
    return (
        dict[language][key] ||
        dict[DEFAULT_LANG][key] ||
        `[${key}]`
    );
}