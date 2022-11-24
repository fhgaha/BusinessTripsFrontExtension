define(['tslib', '@docsvision/webclient/System/ExtensionManager'], function (tslib, ExtensionManager) { 'use strict';

	//В разметке на «редактирование»: при изменении контролов «Даты командировки С:» или «по:» 
	//и, если заполнены оба поля необходимо рассчитать кол-во дней в командировке и записать 
	//в поле «Кол-во дней в командировке».
	function dateSince_ChangeData(sender) {
	    return tslib.__awaiter(this, void 0, void 0, function () {
	        return tslib.__generator(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, SetTripDaysValue(sender)];
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
	                case 0: return [4 /*yield*/, SetTripDaysValue(sender)];
	                case 1:
	                    _a.sent();
	                    return [2 /*return*/];
	            }
	        });
	    });
	}
	function SetTripDaysValue(sender) {
	    return tslib.__awaiter(this, void 0, void 0, function () {
	        var layout, tripDaysContol, otherDateContolName, otherDateContol;
	        return tslib.__generator(this, function (_a) {
	            layout = sender.layout;
	            tripDaysContol = layout.controls.tryGet("tripDays");
	            otherDateContolName = sender.params.name == "dateSince" ? "dateTill" : "dateSince";
	            otherDateContol = layout.controls.tryGet(otherDateContolName);
	            tripDaysContol.value = GetDateDifference(sender, otherDateContol);
	            return [2 /*return*/];
	        });
	    });
	}
	function GetDateDifference(sender, otherDateContol) {
	    var senderDate = sender.value;
	    var otherDate = otherDateContol.value;
	    var senderDateOnly = senderDate.setHours(0, 0, 0, 0);
	    var otherDateOnly = otherDate.setHours(0, 0, 0, 0);
	    var milliseconds = Math.abs(senderDateOnly - otherDateOnly);
	    var millisecondsPerDay = 1000 * 60 * 60 * 24;
	    return Math.floor(milliseconds / millisecondsPerDay);
	}

	var SomeEventHandlers = /*#__PURE__*/Object.freeze({
		__proto__: null,
		dateSince_ChangeData: dateSince_ChangeData,
		dateTill_ChangeData: dateTill_ChangeData
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
