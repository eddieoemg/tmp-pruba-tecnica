const API = (function () {

    const BASE_URL = 'https://jsonplaceholder.typicode.com';

    function getUsers() {
        return $.ajax({
            url: BASE_URL + '/users',
            method: 'GET',
            dataType: 'json',
            timeout: 10000
        });
    }

    return {
        getUsers: getUsers
    };
})();