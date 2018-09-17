export default function getArticleTitles(apiUrl, query) {
    return window
        .fetch(`${apiUrl}?query=${query}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw response;
        });
}
