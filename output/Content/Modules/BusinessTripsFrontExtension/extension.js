define(['tslib', '@docsvision/webclient/Helpers/MessageBox/MessageBox', '@docsvision/webclient/System/ExtensionManager'], function (tslib, MessageBox, ExtensionManager) { 'use strict';

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
	    return Math.floor(milliseconds / millisecondsPerDay);
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

	var SomeEventHandlers = /*#__PURE__*/Object.freeze({
		__proto__: null,
		dateSince_ChangeData: dateSince_ChangeData,
		dateTill_ChangeData: dateTill_ChangeData,
		shortInfo_click: shortInfo_click
	});

	// Главная входная точка всего расширения
	// Данный файл должен импортировать прямо или косвенно все остальные файлы, 
	// чтобы rollup смог собрать их все в один бандл.
	// Регистрация расширения позволяет корректно установить все
	// обработчики событий, сервисы и прочие сущности web-приложения.
	ExtensionManager.extensionManager.registerExtension({
	    name: "Template front extension",
	    version: "5.5.15",
	    globalEventHandlers: [SomeEventHandlers]
	});

});
//# sourceMappingURL=extension.js.map
