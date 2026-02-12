const Validator = {

    rules: {
        name: {
            required: true,
            minLength: 2,
            maxLength: 100
        },
        phone: {
            required: true,
            pattern: /^[0-9]{7,15}$/
        },
        email: {
            required: true,
            maxLength: 254,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
        }
    },

    messages: {
        name: {
            required: 'Nombre es requerido',
            pattern: 'Name contains invalid characters.'
        },

        email: {
            required: 'Correo electronico es requerido.',
            pattern: 'El correo no tiene un formato correcto.'
        }
    },

    // validacion
    validate: function (field, value) {
        var rule = this.rules[field];
        var msg = this.messages[field];
        value = value.trim();

        if (rule?.required && value === '') return msg?.required;
        if (rule?.minLength && value?.length < rule?.minLength) return msg?.minLength;
        if (rule?.maxLength && value?.length > rule?.maxLength) return msg?.maxLength;
        if (rule?.pattern && !rule.pattern.test(value)) return msg?.pattern;

        return null;
    },

    // validar todos los parametros
    validateAll: function (data) {
        var errors = {};
        for (var field in data) {
            var error = this.validate(field, data[field]);
            if (error) errors[field] = error;
        }
        return errors;
    }
};

$(function () {
    var $form = $('#contactForm');
    var $name = $('#name');
    var $phone = $('#phone');
    var $email = $('#email');
    var $btnSubmit = $('#btnSubmit');
    var $btnText = $('#btnText');
    var $btnSpinner = $('#btnSpinner');

    var $alertContainer = $('#alertContainer');
    var $alertMessage = $('#alertMessage');
    var $alertList = $('#alertList');
    var $successContainer = $('#successContainer');
    var $successMessage = $('#successMessage');

    var $recordsBody = $('#recordsBody');
    var $recordsLoader = $('#recordsLoader');
    var $recordsAlert = $('#recordsAlert');
    var $recordsAlertMessage = $('#recordsAlertMessage');
    var $tabRecords = $('#tab-records');
    var $emptyRow = $('#emptyRow');
    var $rowTemplate = $('#recordRowTemplate');

    function showDangerAlert(message, errors) {
        $alertMessage.text(message);
        $alertList.empty().addClass('d-none');

        if (errors) {
            $.each(errors, function (field, msg) {
                var li = document.createElement('li');
                li.textContent = msg;
                $alertList.append(li);
            });
            $alertList.removeClass('d-none');
        }

        $alertContainer.removeClass('d-none').addClass('show');
        $successContainer.addClass('d-none').removeClass('show');
    }

    function showSuccessAlert(message) {
        $successMessage.text(message);
        $successContainer.removeClass('d-none').addClass('show');
        $alertContainer.addClass('d-none').removeClass('show');
    }

    function clearAlerts() {
        $alertContainer.addClass('d-none').removeClass('show');
        $successContainer.addClass('d-none').removeClass('show');
        $alertMessage.text('');
        $alertList.empty().addClass('d-none');
        $successMessage.text('');
    }

    function setFieldError(fieldId, message) {
        $('#' + fieldId).addClass('is-invalid');
        $('#' + fieldId + 'Error').text(message);
    }

    function clearFieldErrors() {
        $form.find('.form-control').removeClass('is-invalid is-valid');
        $form.find('.invalid-feedback').text('');
    }

    function setFieldValid(fieldId) {
        $('#' + fieldId).removeClass('is-invalid').addClass('is-valid');
    }

    function showServerErrors(errors) {
        if (!errors) return;
        $.each(errors, function (field, message) {
            setFieldError(field, message);
        });
    }

    function setLoading(isLoading) {
        $btnSubmit.prop('disabled', isLoading);
        $btnText.toggleClass('d-none', isLoading);
        $btnSpinner.toggleClass('d-none', !isLoading);
    }

    function resetForm(resetAlerts= true) {
        $form[0].reset();
        if(resetAlerts) {
            clearFieldErrors();
            clearAlerts();
        }
    }

    function renderRecords(records) {
        $recordsBody.empty();

        if (!records || records.length === 0) {
            $emptyRow.clone().appendTo($recordsBody);
            return;
        }

        $.each(records, function (i, record) {
            var $row = $($rowTemplate.html());
            $row.find('.row-index').text(i + 1);
            $row.find('.row-name').text(record.name || '');
            $row.find('.row-phone').text(record.phone || '');
            $row.find('.row-email').text(record.email || '');
            $row.find('.row-date').text(record.created_at || '');
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

        API.getContacts()
            .done(function (response) {
                renderRecords(response.data);
            })
            .fail(function () {
                showRecordsError('Error al cargar los registros, intenta de nuevo .');
                $emptyRow.clone().find('td')

                    .removeClass('text-muted').addClass('text-danger')
                    .text('No se encontro ningun registor')
                    .end().appendTo($recordsBody);


            })
            .always(function () {
                $recordsLoader.addClass('d-none');
            });
    }

    $name.on('blur', function () {
        var error = Validator.validate('name', $(this).val());
        error ? setFieldError('name', error) : setFieldValid('name');
    });

    $phone.on('blur', function () {
        var error = Validator.validate('phone', $(this).val());
        error ? setFieldError('phone', error) : setFieldValid('phone');
    });

    $email.on('blur', function () {
        var error = Validator.validate('email', $(this).val());
        error ? setFieldError('email', error) : setFieldValid('email');
    });

    $form.find('.form-control').on('input', function () {
        $(this).removeClass('is-invalid');
    });

    $tabRecords.on('shown.bs.tab', function () {
        loadRecords();
    });

    $form.on('submit', function (e) {
        e.preventDefault();

        clearAlerts();
        clearFieldErrors();

        var data = {
            name: $.trim($name.val()),
            phone: $.trim($phone.val()),
            email: $.trim($email.val()).toLowerCase()
        };

        var errors = Validator.validateAll(data);

        if (Object.keys(errors).length > 0) {
            showServerErrors(errors);
            showDangerAlert('Por favor corrigue los siguientes errores:', errors);
            $form.find('.is-invalid').first().focus();
            return;
        }

        setLoading(true);

        API.saveContact(data)
            .done(function (response) {

                showSuccessAlert(response.message);
                resetForm(false); // Reseteamos el formulario pero sin


            })
            .fail(function (xhr) {
                var res = xhr.responseJSON;

                if (res && res.errors) {
                    showServerErrors(res.errors);
                    showDangerAlert(res.message, res.errors);
                } else if (res && res.message) {
                    showDangerAlert(res.message);
                } else {
                    showDangerAlert('Ha ocurrido un error a la conexion del servicio');
                }
            })
            .always(function () {
                setLoading(false);
            });
    });
});