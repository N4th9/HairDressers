const localhost = 'http://localhost:3000';
let offset = 0;
const limit = 7;

document.addEventListener('DOMContentLoaded', function () {
    const ListHairDressers = document.getElementById('ListHairDressers');

    DisplayHairDressers();

    function fetchData(offset) {
        fetch(localhost + `/api/HairDressers?offset=${offset}`)
            .then(response => response.json())
            .then(function (data) {
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const p = document.createElement('p');
                        p.innerHTML = `
                        <p>${data[i].id}</p>
                        <p>${data[i].nom}</p>
                        <p>${data[i].voie}</p>
                        <p>${data[i].ville}</p>
                        <p>${data[i].code_postal}</p>
                        `;
                        ListHairDressers.appendChild(p);
                    }
                }
            });
    }

    function DisplayHairDressers() {
        fetchData(offset);

        window.addEventListener('scroll', function () {
            if (window.scrollY + window.innerHeight >= document.body.clientHeight) {
                offset += limit;
                fetchData(offset);
            }
        });
    }
});
