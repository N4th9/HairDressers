const localhost = 'http://localhost:3000';
const limit = 8;
let offset = 0;
let isLogged = false;

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
    const Logout = document.getElementById("Logout")
    const InfosHairDressers = document.getElementById("InfosHairDressers")
    const ContainerInfos = document.getElementById("ContainerInfos")
    const ChangeMapLocation = document.getElementById("ChangeMapLocation")
    const ChangeName = document.getElementById("ChangeName")
    const ChangeNumber = document.getElementById("ChangeNumber")
    const ChangeRue = document.getElementById("ChangeRue")
    const ChangeCodePostal = document.getElementById("ChangeCodePostal")
    const ChangeCity = document.getElementById("ChangeCity")
    const ChangeLatitude = document.getElementById("ChangeLatitude")
    const ChangeLongitude = document.getElementById("ChangeLongitude")
    const ChangeHairDresser = document.getElementById("ChangeHairDresser")
    const AddHairDresser = document.getElementById("AddHairDresser")

    DisplayHairDressers();
    StatusConnected();

    LoadHairDressers.addEventListener('click', LoadButton);
    SearchHairDressers.addEventListener('keyup', SearchButton);
    CloseHairDresser.addEventListener('click', CloseX);
    Login.addEventListener('click', LogYou);
    Logout.addEventListener('click', NotConnected);
    AddHairDresser.addEventListener('click', OpenInsertion);
    ChangeHairDresser.addEventListener("click", function () {
        if (ChangeHairDresser.innerText === "Enregistrer") {
            SaveInfosHairDresser();
        } else if (ChangeHairDresser.innerText === "Ajouter") {
            InsertInfosHairDresser();
        }
    });

    function OpenInsertion() {
        pageListSearch.classList.add("details");
        SearchHairDressers.classList.add("searchDetails")
        CloseHairDresser.style.transform = 'rotate(0deg) scale(1)';
        ChangeHairDresser.innerText = "Ajouter";
        ChangeMapLocation.innerHTML = "";
        ChangeName.value = "";
        ChangeNumber.value = "";
        ChangeRue.value = "";
        ChangeCodePostal.value = "";
        ChangeCity.value = "";
        ChangeLatitude.value = "";
        ChangeLongitude.value = "";
    }
    function SaveInfosHairDresser() {
        const id = MyActualHairDresser.id;
        const nom = ChangeName.value;
        const numero = ChangeNumber.value;
        const voie = ChangeRue.value;
        const code_postal = ChangeCodePostal.value;
        const ville = ChangeCity.value;
        const latitude = ChangeLatitude.value;
        const longitude = ChangeLongitude.value;

        fetch(localhost + `/api/HairDressers/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nom: nom, numero: numero, voie: voie, ville: ville, code_postal: code_postal, latitude: latitude, longitude: longitude })
        })
            .then(response => {
                if (response.ok) {
                    alert('Coiffeur modifié avec succès.');
                } else {
                    alert('Erreur lors de la modification du coiffeur.');
                }
            }).then(() => {
                ChangeName.innerText = nom;
                ChangeNumber.innerText = numero;
                ChangeRue.innerText = voie;
                ChangeCodePostal.innerText = code_postal;
                ChangeCity.innerText = ville;
                ChangeLatitude.value = latitude;
                ChangeLongitude.value = longitude;
            if (typeof MyMap !== 'undefined') {
                MyMap.setView([latitude, longitude], 15);
                MyMap.eachLayer(layer => {
                    if (layer instanceof L.Marker) {
                        layer.setLatLng([latitude, longitude]);
                    }
                });
            } else {
                const mapContainer = document.createElement("div");
                mapContainer.id = 'map';
                ChangeMapLocation.innerHTML = "";
                mapContainer.classList.add("maps2");
                ChangeMapLocation.appendChild(mapContainer);
                MyMap = L.map(mapContainer).setView([latitude, longitude], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(MyMap);
                L.marker([latitude, longitude]).addTo(MyMap)
                    .bindPopup('Emplacement')
                    .openPopup();
            }
        })
            .catch(error => {
                console.error('Erreur lors de la requête:', error);
                alert('Erreur lors de la modification du coiffeur.');
            });
    }
    function InsertInfosHairDresser() {
        const nom = ChangeName.value;
        const numero = ChangeNumber.value;
        const voie = ChangeRue.value;
        const code_postal = ChangeCodePostal.value;
        const ville = ChangeCity.value;
        const latitude = ChangeLatitude.value;
        const longitude = ChangeLongitude.value;

        fetch(localhost + `/api/HairDressers`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nom: nom, numero: numero, voie: voie, ville: ville, code_postal: code_postal, latitude: latitude, longitude: longitude })
        })
            .then(response => {
                if (response.ok) {
                    alert('Coiffeur ajouté avec succès.');
                } else {
                    alert('Erreur lors de l\'ajout du coiffeur.');
                }
            }).then(() => {
                ChangeName.value = "";
                ChangeNumber.value = "";
                ChangeRue.value = "";
                ChangeCodePostal.value = "";
                ChangeCity.value = "";
                ChangeLatitude.value = "";
                ChangeLongitude.value = "";
            })
            .catch(error => {
                console.error('Erreur lors de la requête:', error);
                alert('Erreur lors de l\'ajout du coiffeur.');
            });
    }
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
        }
        MyActualHairDresser.id = data[i].id;
        MyActualHairDresser.name = data[i].nom;
        MyActualHairDresser.Number = data[i].numero;
        MyActualHairDresser.Rue = data[i].voie;
        MyActualHairDresser.PostalCode = data[i].code_postal;
        MyActualHairDresser.City = data[i].ville;
        MyActualHairDresser.Latitude = data[i].latitude;
        MyActualHairDresser.Longitude = data[i].longitude;

        MyActualHairDresser.Latitude = data[i].latitude;
        MyActualHairDresser.Longitude = data[i].longitude;
        let latitude = MyActualHairDresser.Latitude;
        let longitude = MyActualHairDresser.Longitude;

        if (isLogged) {
            ChangeName.value = MyActualHairDresser.name;
            ChangeNumber.value = MyActualHairDresser.Number;
            ChangeRue.value = MyActualHairDresser.Rue;
            ChangeCodePostal.value = MyActualHairDresser.PostalCode;
            ChangeCity.value = MyActualHairDresser.City;
            ChangeLatitude.value = MyActualHairDresser.Latitude;
            ChangeLongitude.value = MyActualHairDresser.Longitude;

            const mapContainer = document.createElement("div");
            mapContainer.id = 'map';
            ChangeMapLocation.innerHTML = "";
            mapContainer.classList.add("maps2");
            ChangeMapLocation.appendChild(mapContainer);
            const MyMap = L.map(mapContainer).setView([latitude, longitude], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(MyMap);
            L.marker([latitude, longitude]).addTo(MyMap)
                .bindPopup('Emplacement')
                .openPopup();

            ChangeHairDresser.innerText = "Enregistrer";
        }else if (!isLogged){
            NomHairDresser.innerText = MyActualHairDresser.name;
            NumeroHairDresser.innerText = MyActualHairDresser.Number;
            VoieHairDresser.innerText = MyActualHairDresser.Rue;
            CodePostalHairDresser.innerText = MyActualHairDresser.PostalCode;
            VilleHairDresser.innerText = MyActualHairDresser.City;

            const mapContainer = document.createElement("div");
            mapContainer.id = 'map';
            MapContainerLocation.innerHTML = "";
            mapContainer.classList.add("maps");
            MapContainerLocation.appendChild(mapContainer);
            const MyMap = L.map(mapContainer).setView([latitude, longitude], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(MyMap);
            L.marker([latitude, longitude]).addTo(MyMap)
                .bindPopup('Emplacement')
                .openPopup();
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
    function StatusConnected() {
        fetch(localhost + "/api/IsLoggedIn")
            .then(response => response.json())
            .then(data => {
                isLogged = data.isLoggedIn;
                if (isLogged) {
                    Login.classList.add("Hidden")
                    Logout.classList.remove("Hidden")
                    ContainerInfos.classList.remove("Hidden")
                    InfosHairDressers.classList.add("Hidden")
                    MapContainerLocation.classList.add("Hidden")
                    ChangeHairDresser.classList.remove("Hidden")
                    AddHairDresser.classList.remove("Hidden")
                }else{
                    Login.classList.remove("Hidden")
                    Logout.classList.add("Hidden")
                    ContainerInfos.classList.add("Hidden")
                    InfosHairDressers.classList.remove("Hidden")
                    MapContainerLocation.classList.remove("Hidden")
                    ChangeHairDresser.classList.add("Hidden")
                    AddHairDresser.classList.add("Hidden")
                }
            });
    }
    function NotConnected() {
        fetch(localhost + "/api/Logout")
            .then(response => response.json())
            .then(data => {
                isLogged = data.isLoggedIn;
                window.location.href = window.location.origin;
            });
    }
});