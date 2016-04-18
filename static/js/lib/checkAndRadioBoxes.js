/* Usage */
// customCheckAndRadioBoxes.check();
// customCheckAndRadioBoxes.radio();
var customCheckAndRadioBoxes = (function ($) {
	var combinedHandlers = function () {
		// console.log("Firing combinedHandlers");
		$('.customCheckbox, .customRadiobox').each(function () {
			$(this).addClass('js-custom');
		});
		$('input').on('blur', function () {
			$(this).closest('.customCheckbox').removeClass('focused');
			$(this).closest('.customRadiobox').removeClass('focused');
		}).on('focus', function () {
			$(this).closest('.customCheckbox').addClass('focused');
			$(this).closest('.customRadiobox').addClass('focused');
		});
		selectedPrograms();
		selectAllCustomBoxes();
		activeChecked();
	};
	/** Call the Subscription Request
	 * @param {array} $selectedPrograms
	 * @return {string} $selectedPrograms
	 */
	var selectedPrograms = function () {

		$('.js-trigger-enroll').on('click', function () {
			if (!$('input:checkbox:checked').length) {
				toastr.warning('Please select at least one program to auto-enroll.');
				return;
			}
			var $selectedPrograms = $('input:checkbox:checked').map(function () {
				return $(this).val();
			}).get().join();
			var $selectedProgramNames = $('input:checkbox:checked + label').map(function () {
				return $(this).text();
			}).get().join();
			return enrollPrograms($selectedPrograms, $selectedProgramNames);
		});
	};
	// TO DO: This should be moved to setStoreSubscription.js
	var enrollPrograms = function ($selectedPrograms, $selectedProgramNames) {
		removeChecked();
		return setProgramDefaults.makeRequest($selectedPrograms, $selectedProgramNames);
	};
	var activeChecked = function () {
		$('.checkbox-area[data-enrolled="true"] > .js-all-selectable').addClass('checked');
	};
	var removeChecked = function () {
		return $('#programSummary .customCheckbox.checked').removeClass('checked').find($('input:checkbox')).prop('checked', '');
	};
	// TO DO: Updated storesParticipating values.
	// This would likely be easier to do by making an API request to get programParticipationStats
	var selectAllCustomBoxes = function () {

		/** Toggle Buttons
		 * @todo API request to enroll ALL stores.
		 * @todo API request to enroll & unenroll INDIVIDUAL stores.
		 * @overview Creates custom toggle buttons over input type=[checkbox]
		 * @see {@link http://codepen.io/nikhil8krishnan/pen/eNVZgB}
		 * @author Nikhil Krishnan, Twitter @nikhil8krishnan
		 * @param {class} .toggle-btn wrapper
		 * @param {class) .cb-value input type=[checkbox]
		 * @return {function} toggleBtns();
		 */
		function toggleBtns() {
			// console.log("Running toggleBtns");

			var $programId = getParameterByName('programId', window.location.href);
			var $userId = marcomUserData.$user.externalId || {};
			var visible_store_count = $('.program-enrollment-section .cb-value').length;
			var enrolled_store_count = $('.program-enrollment-section [data-enrolled="true"] .cb-value').length;
			// console.warn('number of $stores ' + visible_store_count);

			if(visible_store_count === enrolled_store_count) {
				$('.enroll-all-stores.btn').addClass('activate').text('Unenroll All');
				// console.warn('All stores enrolled!!');
			}

			$('.cb-value').off('click.vioc').on('click.vioc', function (e) {
				// console.log("Firing checkbox click...");
				e.preventDefault();
				e.stopPropagation();
				var $mainParent = $(this).parent('.toggle-btn');
				var $storeId = $(this).attr('data-storeId');
				enrolled_store_count = $('.program-enrollment-section [data-enrolled="true"] .cb-value').length;
				if ($(this).is(':checked')) {
					$($mainParent).addClass('active');
					$(this).prop('checked', 'checked');
					subscribeStore($userId, $storeId, $programId, 1);
				}
				if (!$(this).is(':checked')) {
					$($mainParent).removeClass('active');
					$(this).prop('checked', '');
					unsubscribeStore($userId, $storeId, $programId, 1);
				}
			});


			$('.enroll-all-stores').off('click.vioc').on('click.vioc', function (e) {
				e.preventDefault();
				e.stopPropagation();

				// Get the count of the visible store checkboxes
				enrolled_store_count = $('.program-enrollment-section [data-enrolled="true"] .cb-value').length;
				// console.warn('visible_store_count: ' + visible_store_count);

				if(visible_store_count === enrolled_store_count) {
					$('.enroll-all-stores.btn').addClass('activate').text('Unenroll All');
					// console.warn('All stores enrolled!!');
				}

				if($(this).hasClass('activate')) {
					// console.log('has class activate');
					$('[data-enrolled="true"] .cb-value').each(function () {
						console.log('all true ones block....');
						var $mainParent = $(this).parent('.toggle-btn');
						var $storeId = $(this).attr('data-storeId');
						$($mainParent).removeClass('active');
						$(this).prop('checked', '');
						subscribeStore($userId, $storeId, $programId, 1);
					});
					$(this).removeClass('activate');
				}
				if(!$(this).hasClass('activate')) {
					// console.log('Doesn\'t have class activate');
					$('[data-enrolled="false"] .cb-value').each(function () {
						var $mainParent = $(this).parent('.toggle-btn');
						var $storeId = $(this).attr('data-storeId');
						$($mainParent).addClass('active');
						$(this).prop('checked', 'checked');
						subscribeStore($userId, $storeId, $programId, 1);
					});
				}
			});
		}

		function subscribeStore($userId, $storeId, $programId) {
			return setStoreSubscription.makeRequest($userId, $storeId, $programId, 1);
		}

		function unsubscribeStore($userId, $storeId, $programId) {
			return setStoreSubscription.makeRequest($userId, $storeId, $programId, 0);
		}

		return toggleBtns();
	};
	var customCheckbox = function () {
		$('.customCheckbox:not(".disabled") input:checkbox').each(function () {
			$(this).parent().addClass('js-custom');
			if ($(this).attr('checked') === 'checked') {
				$(this).closest('.customCheckbox').addClass('checked');
			}
		});
		$('.customCheckbox:not(".disabled")').click(function () {
			if ($(this).hasClass('disabled-checked')) {
				return;
			}
			if (!$(this).children('input[type="checkbox"]').is('[readonly]')) {
				$(this).find('input').trigger('change');
				if ($(this).hasClass('checked')) {
					$(this).removeClass('checked');
					$(this).find($('input[type="checkbox"]')).prop('checked', '');
					$('.program-select .js-trigger-enroll').addClass('input-disabled').attr('title', 'All Stores are Enrolled.');
					if ($('.program-select .checked:not(".disabled")').length >= 1) {
						$('.program-select .js-trigger-enroll').removeClass('input-disabled').attr('title', 'Clicking the Auto-Enroll button will result in all offers being set at the default settings');
					}
				} else {
					$(this).addClass('checked');
					$(this).find($('input[type="checkbox"]')).prop('checked', 'checked').focus();
					$('.program-select .js-trigger-enroll').removeClass('input-disabled').attr('title', 'Clicking the Auto-Enroll button will result in all offers being set at the default settings');
				}
			}
		});
		combinedHandlers();
	};
	var customRadiobox = function () {
		// console.log("Firing customRadiobox");
		$('input:radio').each(function () {
			$(this).wrap('<div class="customRadiobox"></div>');
			$(this).parent().append('<label>' + $(this).data('radiobox-label') + '</label>');
			$(this).css('position', 'absolute').css('left', '-999999px');
		});
		$('input:radio').each(function () {
			if ($(this).attr('checked') === 'checked') {
				$(this).closest('.customRadiobox').addClass('checked');
			}
		});
		$('.customRadiobox').click(function () {
			if (!$(this).children('input[type="radio"]').is('[readonly]')) {
				$(this).find('input').trigger('change');
				if ($(this).hasClass('checked')) {
					// (this).find($('input[type="radio"]')).removeAttr('checked');
				} else {
					$('input[type="radio"][name="' + $(this).find('input:radio').prop('name') + '"]').not($(this)).parent().removeClass('checked');
					$('input[type="radio"][name="' + $(this).find('input:radio').prop('name') + '"]').not($(this)).prop('checked', '');
					$(this).addClass('checked');
					$(this).find($('input[type="radio"]')).prop('checked', 'checked').focus();
				}
			}
		});
		combinedHandlers();
	};
	return {
		customCheckbox: customCheckbox,
		customRadiobox: customRadiobox
	};
})(jQuery);
