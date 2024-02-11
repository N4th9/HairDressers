const localhost = 'http://localhost:3000';
const limit = 8;
let offset = 0;
let totalHairDressers = 0;

let hairDressers = [
    {
        id: 0,
        NameHairDresser: "",
        NumberHairDresser: "",
        StreetHairDresser: "",
        CodePostalHairDresser: "",
        CityHairDresser: "",
    }
];

document.addEventListener('DOMContentLoaded', function () {
    const ListHairDressers = document.getElementById('ListHairDressers');
    const pageListSearch = document.getElementById('pageListSearch');
    const LoadHairDressers = document.getElementById('LoadHairDressers');
    const SearchHairDressers = document.getElementById('SearchHairDressers');
    const BackList = document.getElementById('BackList');

    DisplayHairDressers();

    LoadHairDressers.addEventListener('click', LoadButton);
    SearchHairDressers.addEventListener('keyup', SearchButton);

    function LoadButton() {
        offset += limit;
        fetchData(offset);
    }

    function SearchButton() {
        const searchQuery = SearchHairDressers.value;
        ListHairDressers.innerHTML = '';
        fetch(`/api/searchHairdressers?term=${searchQuery}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    let DivHairDresser = document.createElement('div');
                    DivHairDresser.classList.add('DivHairDresser');

                    let DivInfos = document.createElement('div');
                    DivInfos.classList.add('DivInfos');

                    let DivIndex = document.createElement('div');
                    DivIndex.classList.add('DivIndex');

                    let pTitle = document.createElement('p');
                    pTitle.innerHTML = `<p>${data[i].nom}</p>`;

                    let pVoie = document.createElement('p');
                    pVoie.innerHTML = `<p>${data[i].voie}</p>`;

                    let pCodeVille = document.createElement('p');
                    pCodeVille.innerHTML = `<p>${data[i].code_postal} ${data[i].ville}</p>`;

                    let pIndex = document.createElement('p');
                    pIndex.innerHTML = `<p class="pIndex">${data[i].id}</p>`;
                    pIndex.classList.add('pIndex');

                    ListHairDressers.appendChild(DivHairDresser);
                    DivHairDresser.appendChild(DivInfos);
                    DivHairDresser.appendChild(DivIndex);
                    DivInfos.appendChild(pTitle);
                    DivInfos.appendChild(pVoie);
                    DivInfos.appendChild(pCodeVille);
                    DivIndex.appendChild(pIndex);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la recherche de coiffeurs :', error);
            });
    }


    function DisplayHairDressers() {
        fetchData(offset);

        window.addEventListener('scroll', function () {
            if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
                offset += limit;
                fetchData(offset);
            }
        });
    }

    function fetchData(offset) {
        fetch(localhost + `/api/HairDressers?offset=${offset}`)
            .then(response => response.json())
            .then(function (data) {
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        totalHairDressers = totalHairDressers + 8;
                        let DivHairDresser = document.createElement('div');
                        DivHairDresser.classList.add('DivHairDresser');

                        DivHairDresser.addEventListener('click', function () {
                            pageListSearch.classList.add("details");
                            BackList.classList.add("details");
                        });

                        let DivInfos = document.createElement('div');
                        DivInfos.classList.add('DivInfos');

                        let DivIndex = document.createElement('div');
                        DivIndex.classList.add('DivIndex');

                        let pTitle = document.createElement('p');
                        pTitle.innerHTML = `<p>${data[i].nom}</p>`;

                        let pVoie = document.createElement('p');
                        pVoie.innerHTML = `<p>${data[i].voie}</p>`;

                        let pCodeVille = document.createElement('p');
                        pCodeVille.innerHTML = `<p>${data[i].code_postal} ${data[i].ville}</p>`;

                        let pIndex = document.createElement('p');
                        pIndex.innerHTML = `<p class="pIndex">${data[i].id}</p>`;
                        pIndex.classList.add('pIndex');

                        ListHairDressers.appendChild(DivHairDresser);
                        DivHairDresser.appendChild(DivInfos);
                        DivHairDresser.appendChild(DivIndex);
                        DivInfos.appendChild(pTitle);
                        DivInfos.appendChild(pVoie);
                        DivInfos.appendChild(pCodeVille);
                        DivIndex.appendChild(pIndex);
                    }
                }
            });
    }
});