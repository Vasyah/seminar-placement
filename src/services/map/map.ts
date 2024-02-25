const myHeaders = new Headers();

myHeaders.append("Content-Type", "application/json");

const requestOptions:RequestInit = {
    method: "get",
    headers: myHeaders,
    redirect: "follow",

};

export const getUsers = async (url:string) => {
    return fetch("https://v1.nocodeapi.com/vasyah/google_sheets/ZyLjWOcxxYWoazJO?tabId=main_page", requestOptions)
        .then(response => response.json())
        .catch(error => console.error('error', error));
}
