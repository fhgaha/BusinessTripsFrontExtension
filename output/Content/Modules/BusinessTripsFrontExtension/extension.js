define(['tslib', '@docsvision/webclient/Generated/DocsVision.WebClient.Models', '@docsvision/webclient/Helpers/MessageBox/MessageBox', '@docsvision/webclient/System/LayoutManager', '@docsvision/webclient/System/ServiceUtils', '@docsvision/webclient/System/UrlStore', '@docsvision/webclient/System/ExtensionManager', '@docsvision/webclient/System/Service'], function (tslib, DocsVision_WebClient_Models, MessageBox, LayoutManager, ServiceUtils, UrlStore, ExtensionManager, Service) { 'use strict';

	var CustomCityDataController = /** @class */ (function () {
	    function CustomCityDataController(services) {
	        this.services = services;
	    }
	    CustomCityDataController.prototype.GetCityData = function (cityId) {
	        var url = UrlStore.urlStore.urlResolver.resolveUrl("GetCustomCityData", "CustomCityData");
	        var data = { cityId: cityId };
	        return this.services.requestManager.post(url, JSON.stringify(data));
	    };
	    return CustomCityDataController;
	}());
	var $CustomCityDataController = ServiceUtils.serviceName(function (s) { return s.CustomCityDataController; });

	var CustomEmployeeDataController = /** @class */ (function () {
	    function CustomEmployeeDataController(services) {
	        this.services = services;
	    }
	    CustomEmployeeDataController.prototype.GetEmployeeData = function (employeeId) {
	        var url = UrlStore.urlStore.urlResolver.resolveUrl("GetCustomEmployeeData", "CustomEmployeeData");
	        var data = { employeeId: employeeId };
	        return this.services.requestManager.post(url, JSON.stringify(data));
	    };
	    CustomEmployeeDataController.prototype.GetEmployeesFromGroup = function (groupName) {
	        var url = UrlStore.urlStore.urlResolver.resolveUrl("GetCustomEmployeesFromGroup", "CustomEmployeeData");
	        var data = { groupName: groupName };
	        return this.services.requestManager.post(url, JSON.stringify(data));
	    };
	    return CustomEmployeeDataController;
	}());
	var $CustomEmployeeDataController = ServiceUtils.serviceName(function (s) { return s.CustomEmployeeDataController; });

	var CustomApprovingStageOperationDataController = /** @class */ (function () {
	    function CustomApprovingStageOperationDataController(services) {
	        this.services = services;
	    }
	    CustomApprovingStageOperationDataController.prototype.GetApprovingStageOperationData = function (cardId, approvalStageName) {
	        var url = UrlStore.urlStore.urlResolver.resolveUrl("GetCustomApprovingStageOperationData", "CustomApprovingStageOperationData");
	        var data = { cardId: cardId, approvalStageName: approvalStageName };
	        return this.services.requestManager.post(url, JSON.stringify(data));
	    };
	    return CustomApprovingStageOperationDataController;
	}());
	var $CustomApprovingStageOperationDataController = ServiceUtils.serviceName(function (s) { return s.CustomApprovingStageOperationDataController; });

	//В разметке на «редактирование»: при изменении контролов «Даты командировки С:» или «по:» 
	//и, если заполнены оба поля необходимо рассчитать кол-во дней в командировке и записать 
	//в поле «Кол-во дней в командировке».
	function dateSince_ChangeData(sender) {
	    return tslib.__awaiter(this, void 0, void 0, function () {
	        return tslib.__generator(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, setTripDaysValue(sender)];
	                case 1:
	                    _a.sent();
	                    return [2 /*return*/];
	            }
	        });
	    });
	}
	function dateTill_ChangeData(sender) {
	    return tslib.__awaiter(this, void 0, void 0, function () {
	        return tslib.__generator(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, setTripDaysValue(sender)];
	                case 1:
	                    _a.sent();
	                    return [2 /*return*/];
	            }
	        });
	    });
	}
	function setTripDaysValue(sender) {
	    return tslib.__awaiter(this, void 0, void 0, function () {
	        var layout, tripDaysContol, otherDateContolName, otherDateContol;
	        return tslib.__generator(this, function (_a) {
	            layout = sender.layout;
	            tripDaysContol = layout.controls.tryGet("tripDays");
	            otherDateContolName = sender.params.name == "dateSince" ? "dateTill" : "dateSince";
	            otherDateContol = layout.controls.tryGet(otherDateContolName);
	            if (!tripDaysContol || !otherDateContol)
	                return [2 /*return*/];
	            tripDaysContol.value = getDateDifference(sender, otherDateContol);
	            return [2 /*return*/];
	        });
	    });
	}
	function getDateDifference(sender, otherDateContol) {
	    var senderDate = sender.value;
	    var otherDate = otherDateContol.value;
	    var senderDateOnly = senderDate.setHours(0, 0, 0, 0);
	    var otherDateOnly = otherDate.setHours(0, 0, 0, 0);
	    var milliseconds = Math.abs(senderDateOnly - otherDateOnly);
	    var millisecondsPerDay = 1000 * 60 * 60 * 24;
	    return Math.floor(milliseconds / millisecondsPerDay) + 1;
	}
	//В разметке на «чтение»: добавить на ленту кнопку, по нажатию на кнопку 
	//выводить сообщение (MessageBox.ShowInfo) с краткой информацией по заявке: 
	//«Номер заявки», «Дата создания», «Даты командировки С:», «по:», «Основание для поездки».
	function shortInfo_click(sender) {
	    return tslib.__awaiter(this, void 0, void 0, function () {
	        var layout, numberControl, crDateControl, sinceContol, tillContol, reasonControl;
	        return tslib.__generator(this, function (_a) {
	            layout = sender.layout;
	            numberControl = layout.controls.tryGet("applicationNumber");
	            crDateControl = layout.controls.tryGet("date");
	            sinceContol = layout.controls.tryGet("dateSince");
	            tillContol = layout.controls.tryGet("dateTill");
	            reasonControl = layout.controls.tryGet("reason");
	            if (!numberControl || !crDateControl || !sinceContol || !tillContol || !reasonControl)
	                return [2 /*return*/];
	            MessageBox.MessageBox.ShowInfo("Номер заявки: {0}\n".format(numberControl.hasValue() ? numberControl.value.number : "не задано")
	                + "Дата создания: {0}\n".format(crDateControl.hasValue() ? crDateControl.value.toLocaleDateString() : "не задано")
	                + "Даты командировки С: {0} ".format(sinceContol.hasValue() ? sinceContol.value.toLocaleDateString() : "не задано")
	                + "по: {0}\n".format(tillContol.hasValue() ? tillContol.value.toLocaleDateString() : "не задано")
	                + "Основание для поездки: {0}".format(reasonControl.hasValue() ? reasonControl.value.toString() : "не задано"));
	            return [2 /*return*/];
	        });
	    });
	}
	//#region отмена сохранения, не работает
	//!!! root имеет событие Подготовка к сохранению карточки
	//В разметке на «редактирование»: перед сохранением карточки проверить, что заполнен элемент 
	//«Номер заявки» и «Название», если он пустой, выдавать предупреждение и отменять сохранение.
	function savingButtons_beforeClick(sender, e) {
	    return tslib.__awaiter(this, void 0, void 0, function () {
	        var layout, numberControl, nameControl, savingBtnContol;
	        return tslib.__generator(this, function (_a) {
	            layout = sender.layout;
	            numberControl = layout.controls.tryGet("applicationNumber");
	            nameControl = layout.controls.tryGet("name");
	            savingBtnContol = layout.controls.tryGet("savingButtons");
	            if (!numberControl || !nameControl)
	                return [2 /*return*/];
	            if (!numberControl.hasValue() || !nameControl.hasValue()) {
	                MessageBox.MessageBox.ShowInfo("Поля \"Номер заявки\" и \"Название\" должны быть заполнены");
	                // sender.performCancel();
	                savingBtnContol.performCancel();
	                return [2 /*return*/];
	            }
	            // sender.performSave();
	            savingBtnContol.performSave();
	            return [2 /*return*/];
	        });
	    });
	}
	// export function onCardSaving(sender: Layout, e: CancelableApiEvent<SaveControlDataModelEventArgs>) {
	//     let layout = sender.layout;
	// 	let numberControl = layout.controls.tryGet<Numerator>("applicationNumber");
	// 	let nameControl = layout.controls.tryGet<TextBox>("name");
	// 	if (!numberControl.hasValue() || !nameControl.hasValue())
	// 	{
	// 		MessageBox.ShowInfo("Поля \"Номер заявки\" и \"Название\" должны быть заполнены");
	// 		e.cancel();
	// 		return;
	// 	}
	// 	e.accept();
	// }
	//#endregion
	//В разметке на «редактирование»: при изменении поля «Командируемый», 
	//поля «Руководитель» и «Телефон» необходимо заполнить данными из сотрудника, выбранного в поле.
	function employeeToSend_ChangeData(sender) {
	    return tslib.__awaiter(this, void 0, void 0, function () {
	        var layout, managerControl, phoneControl, customEmplService, model;
	        return tslib.__generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    layout = sender.layout;
	                    managerControl = layout.controls.tryGet("supervisor");
	                    phoneControl = layout.controls.tryGet("phoneNumber");
	                    if (!managerControl || !phoneControl)
	                        return [2 /*return*/];
	                    if (!sender.hasValue()) return [3 /*break*/, 2];
	                    customEmplService = layout.getService($CustomEmployeeDataController);
	                    return [4 /*yield*/, customEmplService.GetEmployeeData(sender.params.value.id)];
	                case 1:
	                    model = _a.sent();
	                    if (model) {
	                        managerControl.params.value = model.manager;
	                        phoneControl.params.value = model.phone;
	                        return [2 /*return*/];
	                    }
	                    _a.label = 2;
	                case 2:
	                    managerControl.params.value = null;
	                    phoneControl.params.value = null;
	                    return [2 /*return*/];
	            }
	        });
	    });
	}
	function elementsLoadedEdit() {
	    return tslib.__awaiter(this, void 0, void 0, function () {
	        return tslib.__generator(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, fillWhoArranges()];
	                case 1:
	                    _a.sent();
	                    return [2 /*return*/];
	            }
	        });
	    });
	}
	function elementsLoadedView() {
	    return tslib.__awaiter(this, void 0, void 0, function () {
	        return tslib.__generator(this, function (_a) {
	            SetToApprovingButtonCanClick();
	            return [2 /*return*/];
	        });
	    });
	}
	// В разметке на «редактирование»: при первом открытии карточки в поле «Кто оформляет» 
	//должны вписываться сотрудники из группы справочника сотрудников - «Секретарь».
	function fillWhoArranges() {
	    return tslib.__awaiter(this, void 0, void 0, function () {
	        var layout, isCreateLayout, managerControl, service, model;
	        return tslib.__generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    layout = LayoutManager.layoutManager.cardLayout;
	                    isCreateLayout = layout.layoutInfo.action = DocsVision_WebClient_Models.GenModels.LayoutAction.Create;
	                    if (!isCreateLayout)
	                        return [2 /*return*/];
	                    managerControl = layout.controls.tryGet("whoArranges");
	                    if (!managerControl)
	                        return [2 /*return*/];
	                    service = layout.getService($CustomEmployeeDataController);
	                    return [4 /*yield*/, service.GetEmployeesFromGroup("Секретарь")];
	                case 1:
	                    model = _a.sent();
	                    if (model) {
	                        managerControl.params.value = model.employees;
	                    }
	                    return [2 /*return*/];
	            }
	        });
	    });
	}
	//В разметке на «редактирование»: при выборе значения в поле «Город», необходимо получить значение 
	//из этого элемента справочника (мы его создавали ранее, поле «Суточные») и вписать в поле 
	//«Сумма командировочных», рассчитав по следующей формуле: 
	//«Суточные» * значение в поле «Кол-во дней в командировке».
	function city_ChangeData(sender) {
	    return tslib.__awaiter(this, void 0, void 0, function () {
	        var layout, tripDaysContol, expensesContol, service, model;
	        return tslib.__generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    layout = sender.layout;
	                    tripDaysContol = layout.controls.tryGet("tripDays");
	                    expensesContol = layout.controls.tryGet("expenses");
	                    if (!tripDaysContol || !expensesContol)
	                        return [2 /*return*/];
	                    if (!tripDaysContol.hasValue())
	                        return [2 /*return*/];
	                    if (!sender.hasValue()) return [3 /*break*/, 2];
	                    service = layout.getService($CustomCityDataController);
	                    return [4 /*yield*/, service.GetCityData(sender.params.value.id)];
	                case 1:
	                    model = _a.sent();
	                    if (model) {
	                        expensesContol.params.value = parseFloat(model.dailyAllowance) * tripDaysContol.value;
	                        return [2 /*return*/];
	                    }
	                    _a.label = 2;
	                case 2:
	                    expensesContol.params.value = null;
	                    return [2 /*return*/];
	            }
	        });
	    });
	}
	// В разметке на «чтение»: добавить кнопку на форму карточки, переводящую карточку в состояние 
	// «На согласование» и доступна только в состоянии «Проект».
	function toApproving_Click(sender) {
	    return tslib.__awaiter(this, void 0, void 0, function () {
	        var layout, stateContol, service, model;
	        return tslib.__generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    layout = sender.layout;
	                    stateContol = layout.controls.tryGet("state");
	                    if (stateContol == null)
	                        return [2 /*return*/];
	                    service = layout.getService($CustomApprovingStageOperationDataController);
	                    return [4 /*yield*/, service.GetApprovingStageOperationData(layout.cardInfo.id, "ToApproving")];
	                case 1:
	                    model = _a.sent();
	                    stateContol.reloadFromServer();
	                    SetToApprovingButtonCanClick();
	                    return [2 /*return*/];
	            }
	        });
	    });
	}
	function SetToApprovingButtonCanClick() {
	    var layout = LayoutManager.layoutManager.cardLayout;
	    var toApprovingControl = layout.controls.tryGet("toApproving");
	    var state = layout.controls.tryGet("state");
	    if (!toApprovingControl || !state)
	        return;
	    var isStateProject = state.params.value.caption == "Проект";
	    var isView = layout.layoutInfo.action == DocsVision_WebClient_Models.GenModels.LayoutAction.View;
	    toApprovingControl.params.disabled = isStateProject && isView ? false : true;
	    toApprovingControl.forceUpdate();
	}
	// В разметке на «редактирование»: добавить кнопку «Запросить стоимость билетов».
	// При ее нажатии должен вызываться метод серверного расширения, который запросит данные 
	// по стоимости билетов. В метод должны быть переданы следующие данные:
	//     • Код аэропорта назначения – по значению, указанному в контроле «Город» необходимо 
	//       получить код аэропорта из справочника.
	//     • Дата вылета – значение контрола «Даты командировки С:»
	//     • Дата прилета – значение контрола «по:»
	// Результатом выполнения данного метода серверного расширения должна быть сумма билетов (туда-обратно), 
	//записанная в контрол «Стоимость билетов» (его необходимо так же добавить, по аналогии с толстым клиентом).
	function getTicketCosts_Click(sender) {
	    return tslib.__awaiter(this, void 0, void 0, function () {
	        var layout;
	        return tslib.__generator(this, function (_a) {
	            layout = sender.layout;
	            return [2 /*return*/];
	        });
	    });
	}

	var SomeEventHandlers = /*#__PURE__*/Object.freeze({
		__proto__: null,
		dateSince_ChangeData: dateSince_ChangeData,
		dateTill_ChangeData: dateTill_ChangeData,
		shortInfo_click: shortInfo_click,
		savingButtons_beforeClick: savingButtons_beforeClick,
		employeeToSend_ChangeData: employeeToSend_ChangeData,
		elementsLoadedEdit: elementsLoadedEdit,
		elementsLoadedView: elementsLoadedView,
		city_ChangeData: city_ChangeData,
		toApproving_Click: toApproving_Click,
		getTicketCosts_Click: getTicketCosts_Click
	});

	// Главная входная точка всего расширения
	// Данный файл должен импортировать прямо или косвенно все остальные файлы, 
	// чтобы rollup смог собрать их все в один бандл.
	// Регистрация расширения позволяет корректно установить все
	// обработчики событий, сервисы и прочие сущности web-приложения.
	ExtensionManager.extensionManager.registerExtension({
	    name: "Business Trip Front Extension",
	    version: "1.0.0",
	    globalEventHandlers: [SomeEventHandlers],
	    layoutServices: [
	        Service.Service.fromFactory($CustomEmployeeDataController, function (services) { return new CustomEmployeeDataController(services); }),
	        Service.Service.fromFactory($CustomCityDataController, function (services) { return new CustomCityDataController(services); }),
	        Service.Service.fromFactory($CustomApprovingStageOperationDataController, function (services) { return new CustomApprovingStageOperationDataController(services); }),
	    ]
	});

});
//# sourceMappingURL=extension.js.map
