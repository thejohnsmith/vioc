var additionalOfferController = (function ($) {

	var controller = {

		program: {},
		config: { "content" : {}, "uiLayout": {}, "preview": {} },
		configLoaded: false,
		saveEnabled: true,
		apiPath: marcomUserData.$constants.apiPath,
		userId: marcomUserData.$user.externalId,
		programId: getParameterByName('programId', window.location.href),
		configId: getParameterByName('configId', window.location.href),

		init: function (config) {
			var controller = this;
			controller.GetProgramData(controller.programId, function (programId) {
				if(typeof controller.configId != "undefined"){
					controller.GetConfigData(controller.configId, function() { controller.UpdateUI() } );
				}
				else
				{
					controller.UpdateUI();
				}

			});
		},
		/** API call to getProgramParticipationStats.jssp
		 * @var {string} userId
		 * @return callback
		 */
		GetProgramData: function (programId, callback) {
			var controller = this;
			$.get(controller.apiPath + 'getProgramParticipationStats.jssp?userId=' + controller.userId, function (results) {

				var json_results = JSON.parse(results);

				// Loop through the API result and find the program that matches program ID (DONE)
				$.each(json_results, function (i, result) {
					// Store the program data in controller.program
					if (result.id == programId) {
						controller.program = result;
					}
				});

				// fire the callback (DONE)
				if (typeof callback === 'function') {
					callback(controller.program);
				}
			});
		},
		/** API call to loadConfig.jssp
		 * @var {string} configId
		 * @var {string} userId
		 * @return callback
		 * Call https://adobe-uat-vioc.epsilon.com/jssp/vioc/loadConfig.jssp?userId=34567&configId=10
		 * Stick the data into controller.config
		 * Fire the callback
		 */
		GetConfigData: function (configId, callback) {
			var controller = this;

			$.get(controller.apiPath + 'loadConfig.jssp?userId=' + controller.userId + '&configId=' + controller.configId, function (results) {

				var json_results = JSON.parse(results);
				controller.config = json_results;
				controller.configLoaded = true;

				if (typeof callback === 'function') {
					callback(json_results);
				}
			});
		},
		UpdateUI: function () {
			var controller = this;
			controller.UpdateTitle();
			controller.UpdateBreadCrumbs();
			controller.UpdateSettingName();
			controller.UpdateOfferExpiration();
			controller.UpdatePreSubmitSidebar();
			controller.AttachEventListeners();
			controller.GeneratePreview();
			controller.ShowUI();
		}
		UpdateTitle: function () {
			var controller = this;
			var title = (controller.configLoaded) ? "Edit " + controller.config.content.label : "Create Additional Offer";

			// Set title
			$("h1.page-title").html(title);

			// Set 4th Level Breadcrumb
			$(".breadcrumbs_current").html(title);
		},
		UpdateBreadCrumbs: function () {
			var controller = this;

			// Set 2nd Level Breadcrumb
			$(".breadcrumbs_previous:first a").html((controller.program.isSpecialtyProgram) ? "Specialty Programs" : "Lifecycle Programs");
			$(".breadcrumbs_previous:first a").attr("href", (controller.program.isSpecialtyProgram) ? marcomUserData.$constants.specialtyPageUrl : marcomUserData.$constants.lifecyclePageUrl);

			// Set 3rd Level Breadcrumb
			$(".breadcrumbs_previous:last a").html(controller.program.programName + " Program");
			$(".breadcrumbs_previous:last a").attr("href", marcomUserData.$constants.programManagementUrl + "&programId=" + controller.programId);
		},
		UpdateSettingName: function () {
			$(".settings-name").val(controller.config.content.label);
		},
		UpdateOfferExpiration: function () {
			var controller = this;
			$('.expiration option[value="' + controller.config.content.expiration + '"]').attr('selected', 'selected');
		},
		AttachEventListeners: function () {
			var controller = this;
			$(".btn-save").on("click", function() { controller.OnPressSave() });
		},
		GetFormData: function () {
			// Grab all inputs by calling $("input,select") and move their values into a key/value object.
			// Returns all form data in an easy to POST format.
		},
		ValidateForm: function() {
			// TODO
			return true;
		}
		OnPressSave: function () {
			var controller = this;
			if (ValidateForm() {
				
				saveData = {
					userId : controller.userId,
					configType: "adtl",
					configId: (controller.configId > 0) ? controller.configId : null,
					programId: 0,
					label: $(".settings-name").val(),
					adtlCode: $('.coupon-code').val(),
					adtlText: $('.coupon-text').val(),
					adtlApproach: $('.coupon-approach').val(),
					adtlValue: $('.coupon-amount').val(),
					expiration: $('.expiration').val()
				};
				
				$.get({
					url : controller.apiPath + 'saveConfig.jssp',
					data: saveData,
					success: function(results) {
						console.log("Save was successful!");
						window.location.href = marcomUserData.$constants.programManagementUrl + "&programId=" + controller.programId + "&flashSuccessMsg=Additional%20Offer%20Saved!";
					},
					dataType: "json"
				});
				
			});
			console.log("Save pressed!", this);
		},
		ShowUI: function() {
			$(".js-content").show();
			$(".js-loading").hide();
		}
	};
	return {
		controller: controller
	};
})(jQuery);

if (window.location.href.indexOf(marcomUserData.$constants.additionalOfferPageUrl) > -1)
{
	$j(".js-content").hide();
	$j(".js-loading").show();
	additionalOfferController.controller.init();
}