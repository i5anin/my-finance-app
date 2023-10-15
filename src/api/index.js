// Функции для взаимодействия с API
export function getEntries() {
    return fetch("http://localhost:3000/entries")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching entries:', error);
            throw error;  // Перебрасываем ошибку, чтобы можно было её обработать и в компоненте
        });
}

export function deleteEntry(id) {
    return fetch(`http://localhost:3000/entries/${id}`, {
        method: "DELETE",
    })
        .catch(error => {
            console.error('Error deleting entry:', error);
            throw error;  // Перебрасываем ошибку, чтобы можно было её обработать и в компоненте
        });
}

export function addOrUpdateEntry(entry, id = null) {
    const url = id ? `http://localhost:3000/entries/${id}` : "http://localhost:3000/entries";
    const method = id ? "PUT" : "POST";

    return fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
    })
        .catch(error => {
            console.error('Error adding or updating entry:', error);
            throw error;  // Перебрасываем ошибку, чтобы можно было её обработать и в компоненте
        });
}

