// Файл: src/services/networkTest.js

const TEST_FILE_URL = 'https://core.mektepium.com/image/index.php/network_test.png';
const TEST_FILE_SIZE_BYTES = 105820;
const CRITICAL_TIME_SECONDS = 1.5;
const CRITICAL_TIME_MS = CRITICAL_TIME_SECONDS * 1000;

// Вспомогательная функция: создает промис, который завершается ошибкой таймаута
const timeoutPromise = (ms) => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            // Создаем пользовательскую ошибку для таймаута
            reject(new Error('TIMEOUT_EXCEEDED'));
        }, ms);
    });
};

const calculateSpeed = (durationSeconds) => {
    return (TEST_FILE_SIZE_BYTES * 8) / durationSeconds / 1048576;
}

export async function checkDownloadSpeed() {

    // Промис, который выполняет загрузку файла
    const fetchPromise = async () => {
        const startTime = performance.now();

        // 1. Выполняем fetch без AbortController
        const response = await fetch(TEST_FILE_URL, { cache: 'no-store' });

        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }

        // Ждем полной загрузки
        await response.blob();

        const endTime = performance.now();
        const durationSeconds = (endTime - startTime) / 1000;

        return {
            duration: durationSeconds,
            speedMbps: calculateSpeed(durationSeconds),
            isSlow: durationSeconds > CRITICAL_TIME_SECONDS
        };
    };

    try {
        // 2. "Соревнование" между загрузкой и таймаутом
        const result = await Promise.race([
            fetchPromise(),
            timeoutPromise(CRITICAL_TIME_MS)
        ]);

        // Если победил fetchPromise, возвращаем его результат
        return {
            speedMbps: result.speedMbps.toFixed(2),
            duration: result.duration.toFixed(2),
            isSlow: result.isSlow
        };

    } catch (error) {

        // 3. Обработка ошибки ТАЙМАУТА
        if (error.message === 'TIMEOUT_EXCEEDED') {

            // Если таймаут победил, значит, прошло 1.5 секунды.
            const minSpeedRequired = calculateSpeed(CRITICAL_TIME_SECONDS);

            return {
                speedMbps: minSpeedRequired.toFixed(2),
                // Показываем, что время превысило критическое
                duration: `>${CRITICAL_TIME_SECONDS.toFixed(1)}`,
                isSlow: true
            };
        }

        // 4. Обработка других ошибок (нет сети, CORS, DNS)
        console.error("Критическая ошибка сети:", error);
        return {
            speedMbps: 0,
            duration: -1,
            isSlow: true
        };
    }
}
