// Contact dialog: Bootstrap manages backdrop, Escape and focus containment.
(function ($) {
  'use strict';

  var modal = document.getElementById('contact-modal');
  var form = document.getElementById('contact-modal-form');
  var thanksModal = document.getElementById('contact-thanks-modal');
  if (!modal || !form || !thanksModal) return;

  var nameField = form.elements.namedItem('name');
  var phoneField = form.elements.namedItem('phone');
  var messageField = form.elements.namedItem('message');
  var status = document.getElementById('contact-modal-status');
  var attempted = false;
  var completing = false;
  var trigger = null;
  var submitButton = form.querySelector('[type="submit"]');

  $(modal).on('show.bs.modal', function (event) {
    trigger = event.relatedTarget || document.activeElement;
  });

  $(thanksModal).on('shown.bs.modal', function () {
    document.getElementById('contact-thanks-close').focus();
  });

  $(thanksModal).on('hidden.bs.modal', function () {
    if (trigger && typeof trigger.focus === 'function') trigger.focus();
  });

  function validateField(field) {
    var value = field.value.trim();
    var valid;
    if (field === nameField) {
      valid = value.length >= 2 && value.length <= 60;
    } else if (field === phoneField) {
      valid = /^(?:0[0-9]{9}|\+380[0-9]{9})$/.test(value.replace(/[\s()-]/g, ''));
    } else {
      valid = value.length >= 10 && value.length <= 1000;
    }
    field.classList.toggle('is-invalid', !valid);
    field.setAttribute('aria-invalid', String(!valid));
    return valid;
  }

  [nameField, phoneField, messageField].forEach(function (field) {
    field.addEventListener('input', function () {
      status.textContent = '';
      if (attempted) validateField(field);
    });
  });

  $(modal).on('shown.bs.modal', function () {
    nameField.focus();
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (completing) return;
    attempted = true;
    var invalid = [nameField, phoneField, messageField].filter(function (field) {
      return !validateField(field);
    });
    if (invalid.length) {
      status.textContent = 'Перевірте позначені поля.';
      invalid[0].focus();
      return;
    }

    completing = true;
    submitButton.disabled = true;
    // Wait for the first backdrop to disappear before opening another modal.
    $(modal).one('hidden.bs.modal', function () {
      form.reset();
      attempted = false;
      status.textContent = '';
      [nameField, phoneField, messageField].forEach(function (field) {
        field.classList.remove('is-invalid');
        field.removeAttribute('aria-invalid');
      });
      submitButton.disabled = false;
      completing = false;
      $(thanksModal).modal('show');
    });
    $(modal).modal('hide');
  });
})(jQuery);

