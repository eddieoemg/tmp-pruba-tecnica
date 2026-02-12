$(function () {


    var $recordsLoader = $('#recordsLoader');
    var $recordsAlert = $('#recordsAlert');


    var $recordsBody = $('#recordsBody');
    var $rowTemplate = $('#recordTemplate');

    var $recordsAlertMessage = $('#recordsAlertMessage');
    var $emptyRow = $('#emptyRow');


    function formatAddress(address) {
        if (!address) return '';
        return address.street + ', ' + address.suite + ', ' + address.city + ' ' + address.zipcode;
    }

    function renderRecords(records) {
        $recordsBody.empty();

        if (!records || records.length === 0) {
            $emptyRow.clone().appendTo($recordsBody);
            return;
        }

        $.each(records, function (i, user) {
            var $row = $($rowTemplate.html());
            $row.find('.row-id').text(user.id || '');
            $row.find('.row-name').text(user.name || '');
            $row.find('.row-username').text(user.username || '');
            $row.find('.row-email').text(user.email || '');
            $row.find('.row-phone').text(user.phone || '');
            $row.find('.row-website').text(user.website || '');
            $row.find('.row-address').text(formatAddress(user.address));
            $row.find('.row-company').text(user.company ? user.company.name : '');
            $recordsBody.append($row);
        });
    }

    function showRecordsError(message) {
        $recordsAlertMessage.text(message);
        $recordsAlert.removeClass('d-none').addClass('show');
    }

    function clearRecordsAlert() {
        $recordsAlert.addClass('d-none').removeClass('show');
        $recordsAlertMessage.text('');
    }

    function loadRecords() {
        $recordsLoader.removeClass('d-none');
        clearRecordsAlert();
        $recordsBody.empty();

        API.getUsers()
            .done(function (response) {
                renderRecords(response);
            })
            .fail(function () {
                showRecordsError('Error al cargar los usuarios, intenta de nuevo.');
                $emptyRow.clone().find('td')
                    .removeClass('text-muted').addClass('text-danger')
                    .text('No se encontro ningun registro')
                    .end().appendTo($recordsBody);
            })
            .always(function () {
                $recordsLoader.addClass('d-none');
            });
    }

    // Cargar al iniciar
    loadRecords();
});