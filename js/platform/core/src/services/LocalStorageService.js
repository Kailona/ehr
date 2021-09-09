class LocalStorageService {
    getItem(itemName) {
        return localStorage.getItem(itemName);
    }

    upsertItem(itemName, data) {
        return localStorage.setItem(itemName, data);
    }

    removeItem(itemName) {
        return localStorage.removeItem(itemName);
    }
}

const localStorageService = new LocalStorageService();
export default localStorageService;
