const addInLocalStorage = (data: unknown[], key: string): void => {
    const dataIntoLocalStorage = window.localStorage.getItem(key);
    if (dataIntoLocalStorage) {
        const models: unknown[] = new Array(
            ...JSON.parse(dataIntoLocalStorage)
        );
        const newModels = JSON.stringify([...models, ...data]);
        window.localStorage.setItem(key, newModels);
    } else {
        window.localStorage.setItem(key, JSON.stringify([...data]));
    }
};

export default addInLocalStorage;
