(function () {
    // Capa de guardado: historial y record viven en localStorage del navegador.
    const STORAGE_KEY = "panchoSnakeMatches";
    const RECORD_KEY = "panchoSnakeRecord";

    function getMatches() {
        // Si el JSON esta roto o vacio, vuelve a una lista segura.
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return [];
        }

        try {
            return JSON.parse(saved);
        } catch (error) {
            return [];
        }
    }

    function saveMatch(match) {
        // Mantiene solo las ultimas 12 partidas para que el historial no crezca sin limite.
        const matches = getMatches();
        matches.unshift(match);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(matches.slice(0, 12)));
    }

    function getRecord() {
        const saved = localStorage.getItem(RECORD_KEY);

        if (!saved) {
            return null;
        }

        try {
            return JSON.parse(saved);
        } catch (error) {
            return null;
        }
    }

    function saveRecord(record) {
        localStorage.setItem(RECORD_KEY, JSON.stringify(record));
    }

    function updateRecord(match) {
        // El record se decide por puntaje total, sin sistema de ganador.
        const currentRecord = getRecord();

        if (!currentRecord || match.totalScore > currentRecord.totalScore) {
            const newRecord = {
                totalScore: match.totalScore,
                players: match.players,
                mode: match.mode,
                durationText: match.durationText,
                date: match.date
            };

            saveRecord(newRecord);
            return {
                record: newRecord,
                isNewRecord: true
            };
        }

        return {
            record: currentRecord,
            isNewRecord: false
        };
    }

    function clearMatches() {
        localStorage.removeItem(STORAGE_KEY);
    }

    function clearRecord() {
        localStorage.removeItem(RECORD_KEY);
    }

    window.StorageService = {
        getMatches,
        saveMatch,
        getRecord,
        updateRecord,
        clearMatches,
        clearRecord
    };
})();
