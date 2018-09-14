export default function callArticleTitles(siteId, query) {
    return window
        .fetch(getUrl(siteId, query))
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw response;
        });
}

const getUrl = (siteId, query) => `https://services.wikia.com/discussion/${siteId}/article-titles?query=${query}`;
