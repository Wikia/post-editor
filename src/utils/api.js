export default function callArticleTitles(apiUrl, query) {
    return window
        .fetch(`${apiUrl}?query=${query}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw response;
        });
}
