import { readFilePromise } from './registrationPage'; // Импорт из правильного файла

export function readTemplate(fileName: string): Promise<string> {
    return readFilePromise(fileName)
        .catch(err => {
            console.log("Не смогли прочитать файл: ", err);
            throw err; // Пробрасываем ошибку дальше
        });
}
