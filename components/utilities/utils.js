/*
    to sort a list of objects alphabetically,
    pass in the data (array) and the name of the field (string) with which to sort
 */
export const alphabetize = (data, field) => {
    return data.sort((a, b) => {
        if (a[field] < b[field]) { return -1; }
        if (a[field] > b[field]) { return 1; }
        return 0;
    });
};

// "value" and "label" fields are required by react-select and should correspond to "id" and "name"
export const addSelectFields = (data) => {
    if (Array.isArray(data)) {
        return data.map(obj => {
            return { ...obj, value: obj.id, label: obj.name };
        });
    } else {
        return { ...data, value: data.id, label: data.name };
    }
};
