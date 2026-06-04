class Storage {
    // API URL de tu servidor Node.js
    static API_URL = '/api/history';

    static async getMatchHistory() {
        try {
            const response = await fetch(this.API_URL);
            if (!response.ok) throw new Error('Error al conectar con el servidor');
            return await response.json(); 
        } catch (error) {
            console.error("No se pudo leer history.json:", error);
            return [];
        }
    }

    static async saveMatchHistory(matchData) {
        try {
            await fetch(this.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(matchData)
            });
        } catch (error) {
            console.error("No se pudo guardar la partida:", error);
        }
    }

    static async clearHistory() {
        try {
            await fetch(this.API_URL, { method: 'DELETE' }); 
        } catch (error) {
            console.error("No se pudo borrar el historial:", error);
        }
    }

    static getHighScore() {
        const record = localStorage.getItem('bover_highScore');
        return record ? parseInt(record) : 0;
    }

    static checkAndSaveRecord(currentScore) {
        const currentRecord = this.getHighScore();
        if (currentScore > currentRecord) {
            localStorage.setItem('bover_highScore', currentScore);
            return true;
        }
        return false;
    }
}
