
const API = (function () {

    const BASE_URL = 'https://prueba-tecnica.io/api/index.php';

    function saveContact(data) {
        return $.ajax({
            url: BASE_URL,
            method: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(data),
            timeout: 10000
        });
    }

    function getContacts() {
        return $.ajax({
            url: BASE_URL,
            method: 'GET',
            dataType: 'json',
            timeout: 10000
        });
    }

    return {
        saveContact: saveContact,
        getContacts: getContacts
    };
})();