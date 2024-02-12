const localhost = 'http://localhost:3000';
const limit = 8;
let offset = 0;

let MyActualHairDresser = [
    {
        id: 0,
        Name: "",
        Number: "",
        Rue: "",
        PostalCode: "",
        City: "",
        Latitude: "",
        Longitude: ""
    }
];

document.addEventListener('DOMContentLoaded', function () {
    const ListHairDressers = document.getElementById('ListHairDressers');
    const pageListSearch = document.getElementById('pageListSearch');
    const LoadHairDressers = document.getElementById('LoadHairDressers');
    const SearchHairDressers = document.getElementById('SearchHairDressers');
    const BackList = document.getElementById('BackList');
    const NomHairDresser = document.getElementById("NomHairDresser")
    const NumeroHairDresser = document.getElementById("NumeroHairDresser")
    const VoieHairDresser = document.getElementById("VoieHairDresser")
    const CodePostalHairDresser = document.getElementById("CodePostalHairDresser")
    const VilleHairDresser = document.getElementById("VilleHairDresser")
    const MapContainerLocation = document.getElementById("MapContainerLocation")
    const CloseHairDresser = document.getElementById("CloseHairDresser")
    const Login = document.getElementById("Login")

    DisplayHairDressers();

    LoadHairDressers.addEventListener('click', LoadButton);
    SearchHairDressers.addEventListener('keyup', SearchButton);
    CloseHairDresser.addEventListener('click', CloseX);
    Login.addEventListener('click', LogYou);

    function LogYou() {
        window.location.href = '/connected.html';
    }
    function CloseX() {
        pageListSearch.classList.remove("details");
        SearchHairDressers.classList.remove("searchDetails")
        CloseHairDresser.style.transform = 'rotate(0deg) scale(0)';
        const allHairDressers = document.querySelectorAll('.DivHairDresser');
        allHairDressers.forEach(hairDresser => {
            hairDresser.classList.remove("Purple");
        });
    }
    function LoadInfosHairDresser(DivHairDresser, data, i) {
        console.log(data[i])
        if (DivHairDresser.classList.contains("Purple")) {
            pageListSearch.classList.remove("details");
            DivHairDresser.classList.remove("Purple");
            SearchHairDressers.classList.remove("searchDetails")
            CloseHairDresser.style.transform = 'rotate(0deg) scale(0)';
        } else {
            const allHairDressers = document.querySelectorAll('.DivHairDresser');
            allHairDressers.forEach(hairDresser => {
                hairDresser.classList.remove("Purple");
            });
            pageListSearch.classList.add("details");
            BackList.classList.add("details");
            DivHairDresser.classList.add("Purple");
            SearchHairDressers.classList.add("searchDetails")
            CloseHairDresser.style.transform = 'rotate(0deg) scale(1)';
            console.log(data[i]);
        }
        MyActualHairDresser.id = data[i].id;
        MyActualHairDresser.name = data[i].nom;
        MyActualHairDresser.Number = data[i].numero;
        MyActualHairDresser.Rue = data[i].voie;
        MyActualHairDresser.PostalCode = data[i].code_postal;
        MyActualHairDresser.City = data[i].ville;

        NomHairDresser.innerText = MyActualHairDresser.name;
        NumeroHairDresser.innerText = MyActualHairDresser.Number;
        VoieHairDresser.innerText = MyActualHairDresser.Rue;
        CodePostalHairDresser.innerText = MyActualHairDresser.PostalCode;
        VilleHairDresser.innerText = MyActualHairDresser.City;

        MyActualHairDresser.Latitude = data[i].latitude;
        MyActualHairDresser.Longitude = data[i].longitude;
        let latitude = MyActualHairDresser.Latitude;
        let longitude = MyActualHairDresser.Longitude;

        if (MyActualHairDresser.Latitude !== undefined && MyActualHairDresser.Longitude !== undefined) {
            const mapContainer = document.createElement("div");
            mapContainer.id = 'map';
            mapContainer.classList.add("maps");
            MapContainerLocation.innerHTML = "";
            MapContainerLocation.appendChild(mapContainer);
            const MyMap = L.map(mapContainer).setView([latitude, longitude], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(MyMap);

            L.marker([latitude, longitude]).addTo(MyMap)
                .bindPopup('Emplacement')
                .openPopup();
        } else {
            console.error("Latitude ou longitude manquante pour le coiffeur :", data[i]);
        }
    }
    function DataHairDressers(data) {
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let DivHairDresser = document.createElement('div');
                DivHairDresser.classList.add('DivHairDresser');

                DivHairDresser.addEventListener('click', function () {
                    LoadInfosHairDresser(DivHairDresser, data, i);
                });

                let DivInfos = document.createElement('div');
                DivInfos.classList.add('DivInfos');

                let DivIndex = document.createElement('div');
                DivIndex.classList.add('DivIndex');

                let pTitle = document.createElement('p');
                pTitle.innerHTML = `<p>${data[i].nom}</p>`;

                let pVoie = document.createElement('p');
                pVoie.innerHTML = `<p>${data[i].numero} ${data[i].voie}</p>`;

                let pCodeVille = document.createElement('p');
                pCodeVille.innerHTML = `<p>${data[i].code_postal} ${data[i].ville}</p>`;

                let pIndex = document.createElement('p');
                pIndex.innerHTML = `<p class="pIndex">${data[i].id}</p>`;
                pIndex.classList.add('pIndex');

                DivHairDresser.appendChild(DivInfos);
                DivHairDresser.appendChild(DivIndex);
                DivInfos.appendChild(pTitle);
                DivInfos.appendChild(pVoie);
                DivInfos.appendChild(pCodeVille);
                DivIndex.appendChild(pIndex);
                ListHairDressers.appendChild(DivHairDresser); // Ajout à la liste existante
            }
        }
    }
    function LoadButton() {
        offset += limit;
        if (SearchHairDressers.value === '') {
            fetchData(offset);
        } else {
            SearchButton(offset);
        }
    }
    function SearchButton(offset) {
        const searchQuery = SearchHairDressers.value;
        fetch(`/api/searchHairdressers?term=${searchQuery}&offset=${offset}`)
            .then(response => response.json())
            .then(data => {
                ListHairDressers.innerHTML = '';
                DataHairDressers(data);
            })
            .catch(error => {
                console.error('Erreur lors de la recherche de coiffeurs :', error);
            });
    }
    function DisplayHairDressers() {
        fetchData(offset);
        window.addEventListener('scroll', function () {
            if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
                if (SearchHairDressers.value === '') {
                    offset += limit;
                    fetchData(offset);
                } else if (SearchHairDressers.value !== '') {
                    offset += limit;
                    SearchButton(offset);
                }
            }
        });
    }
    function fetchData(offset) {
        fetch(localhost + `/api/HairDressers?offset=${offset}`)
            .then(response => response.json())
            .then(function (data) {
                DataHairDressers(data);
            });
    }
});