class SessionStorageService {
    getItem(itemName) {
        return sessionStorage.getItem(itemName);
    }

    upsertItem(itemName, data) {
        return sessionStorage.setItem(itemName, data);
    }

    removeItem(itemName) {
        return sessionStorage.removeItem(itemName);
    }
}

const sessionStorageService = new SessionStorageService();
export default sessionStorageService;
