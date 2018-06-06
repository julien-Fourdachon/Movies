//API/TMDBApi.js

const API_TOKEN = "e002619bc7e0cd9f310ab06e83640fa4";

export function getFilmsFromApiWithSearchedText (text, page) {
    const url = 'https://api.themoviedb.org/3/search/movie?api_key=' + "e002619bc7e0cd9f310ab06e83640fa4" + '&language=fr&query=' + text + '&page' + page
        return fetch(url)
            .then((response) => response.json())
            .catch((error) => {
            console.error(error);
            });

}
export function getImageFromApi(name) {
    return 'https://image.tmdb.org/t/p/w300' + name
}