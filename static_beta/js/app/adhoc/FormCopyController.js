/* FormCopy Controller
 * @NOTE - The On-Demand Marketing URL for Beta is:
 * @URL - https://marcomcentral.app.pti.com/Epsilon_Data_Management/Beta_Epsilon/catalog.aspx?uigroup_id=479602&folder_id=1633307
 *
 * @description - Loads templates with data from custom Adobe API.
 * @filename - FormCopyController.js
 * @author - Anthony Gill, John Smith : Epsilon 2016
 */
var pageAnchor = '#ctl00_content_CtlAddToCart_ProductFootnote_divFootNote';
var pageKey = 'addToCart.aspx';

FormCopyController = (function ($) {
	'use strict';
	var controller = {
		intervalHandle: null,
		init: function () {
			var controller = this;
			controller.WatchForPageReady(function () {
				controller.AdjustUI();
			});
		},
		isPageReady: function () {
			return $(pageAnchor).length > 0;
		},
		WatchForPageReady: function (callback) {
			var controller = this;
			//  console.warn('Watching for: Page ready...');
			controller.intervalHandle = setInterval(function () {
				if (controller.isPageReady()) {
					clearInterval(controller.intervalHandle);
					callback();
				}
			}, 500);
		},
		AdjustUI: function () {
			var controller = this;
			console.debug('123 Adjusting UI...');
			controller.SetNavigation();
			// var pricePerEmail = 0.0015;
			// var number = value of input field
			// var cost = ((number * pricePerEmail).toFixed(2));  
			// $('#cost').html('Cost: $' + cost);

			// Change Add To Cart text on submit button to, 'Send for Approval'
			$('.ButtonAddToCart.addToCartBtn span:contains("Add to Cart")').html('Send for Approval');

			// Change Qty text to, 'Recipients'
			$('.qtyInputContainer span:contains("Qty:")').html('Recipients');

			// Add Pricing
			$('.qtyInputContainer').append('<div id="costContainer"><span id="cost" class="FontBold">Cost: $0.00</span></div>');

			/**
			 * pricePerEmail
			 * @NOTE !! Cost will be static for the power-users demonstration !!
			 * @TODO:
			 * 		Enable cost updating
			 *   	Use onChange for Qty field
			 *    Make sure the cost does not get duplicated
			 * @type {Number}
			 */
			// var pricePerEmail = 0.0015;
			// var number = $('.qtyInputContainer input').val();
			// var cost = ((number * pricePerEmail).toFixed(2));  
			// $('#cost').html('Cost: $' + cost);

			// Change required helper text by removing the Senior Purchaser bit.
			$('#ctl00_content_CtlAddToCart_InteractivityContainer_ProductFootnote_Stringcontrol3:contains("Item requires approval by Senior Purchaser")').html('Item requires approval');

			var htmlComments = $('*').contents().filter(function () {
				return this.nodeType === 8;
			});
			$('td, tr').filter(function () {
				$.trim($(this).html()) === '&nbsp;';
				$.trim($(this).html()) === '';
			}).remove();

			// $('#ctl00_content_CatalogBreadCrumbsLayout_CatalogBreadCrumbs_btnItem2').hide();
			// $('#ctl00_content_CatalogBreadCrumbsLayout_CatalogBreadCrumbs_btnItem1').prev().remove();

			// if ($('#C1ExpirationDate').length) {
			// 	console.info('C1ExpirationDate exists.');
			// 	var C1ExpirationDate = $('#C1ExpirationDate');
			// 	var updateProofBtn = $('#mButtonPreviewTop');
			// 	var quote = 'Expires: ';
			//
			// 	$.datepicker.setDefaults({
			// 		showOn: "both",
			// 		buttonImageOnly: true,
			// 		currentText: "Expires",
			// 		numberOfMonths: 2,
			// 		onClose: function () {
			// 			console.info('datepicker closed.');
			// 			// $(".to_date").datepicker("option", "minDate", selectedDate);
			// 			C1ExpirationDate.val(function (index, selectedDate) {
			// 				return 'Expires: ' + selectedDate;
			// 			});
			// 		}
			// 	});

			// updateProofBtn.hover(function () {
			// 	C1ExpirationDate.val(function (index, old) {
			//
			// 		// return 'Expires: ' + old;
			// 	});
			// });
			// }
			// updateProofBtn.on('change click', function () {
			// C1ExpirationDate.val('Expires: ' + C1ExpirationDate.val());

		},
		/**
		 * [SetNavigation Set navigation state]
		 */
		SetNavigation: function () {
			$('.navBarItem > a').filter(function () {
				return $(this).text() === 'ON DEMAND MARKETING';
			}).addClass('navBarSelectedLinkColor').addClass('customColorOverridable').removeClass('navBarEnhancedLinkColor');
		},
	};
	return {
		controller: controller
	};
})(jQuery);

// Only execute this controller on the addToCart page.
if (window.location.href.indexOf(pageKey) > -1) {
	FormCopyController.controller.init();
}
