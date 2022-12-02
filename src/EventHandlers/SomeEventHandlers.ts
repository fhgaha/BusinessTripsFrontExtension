import { CardApprovalStage } from "@docsvision/webclient/Approval/CardApprovalStage";
import { CardKind } from "@docsvision/webclient/BackOffice/CardKind";
import { DirectoryDesignerRow } from "@docsvision/webclient/BackOffice/DirectoryDesignerRow";
import { Employee } from "@docsvision/webclient/BackOffice/Employee";
import { findStaffSection } from "@docsvision/webclient/BackOffice/FindStaffSection";
import { MultipleEmployees } from "@docsvision/webclient/BackOffice/MultipleEmployees";
import { Numerator } from "@docsvision/webclient/BackOffice/Numerator";
import { State } from "@docsvision/webclient/BackOffice/State";
import { $CardController, $DepartmentController, $EmployeeController, $LayoutStaffController, $StaffDirectoryItemsController } from "@docsvision/webclient/Generated/DocsVision.WebClient.Controllers";
import { GenModels } from "@docsvision/webclient/Generated/DocsVision.WebClient.Models";
import { MessageBox } from "@docsvision/webclient/Helpers/MessageBox/MessageBox";
import { $EmployeesController } from "@docsvision/webclient/Legacy/EmployeesController";
import { ContextMenu } from "@docsvision/webclient/Platform/ContextMenu";
import { CustomButton } from "@docsvision/webclient/Platform/CustomButton";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { ISavingButtonClickEventArgs } from "@docsvision/webclient/Platform/ISavingButtonClickEventArgs";
import { NumberControl } from "@docsvision/webclient/Platform/Number";
import { SavingButtons } from "@docsvision/webclient/Platform/SavingButtons";
import { services } from "@docsvision/webclient/Platform/TestUtils";
import { TextArea } from "@docsvision/webclient/Platform/TextArea";
import { TextBox } from "@docsvision/webclient/Platform/TextBox";
import { CancelableApiEvent } from "@docsvision/webclient/System/ApiEvent";
import { BaseControl } from "@docsvision/webclient/System/BaseControl";
import { ControlContext } from "@docsvision/webclient/System/ControlContext";
import { ICancelableEventArgs } from "@docsvision/webclient/System/ICancelableEventArgs";
import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";
import { Layout, SaveControlDataModelEventArgs } from "@docsvision/webclient/System/Layout";
import { layoutManager } from "@docsvision/webclient/System/LayoutManager";
import { func } from "prop-types";
import { $CustomCityDataController } from "../Controllers/CustomCityDataController";
import { $CustomEmployeeDataController } from "../Controllers/CustomEmployeeDataController";
import { $CustomApprovingStageOperationDataController } from "../Controllers/CustomOperationDataController";

//В разметке на «редактирование»: при изменении контролов «Даты командировки С:» или «по:» 
//и, если заполнены оба поля необходимо рассчитать кол-во дней в командировке и записать 
//в поле «Кол-во дней в командировке».
export async function dateSince_ChangeData(sender: DateTimePicker) {
	await setTripDaysValue(sender);
}

export async function dateTill_ChangeData(sender: DateTimePicker) {
	await setTripDaysValue(sender);
}

async function setTripDaysValue(sender: DateTimePicker) {
	let layout = sender.layout;
	let tripDaysContol = layout.controls.tryGet<NumberControl>("tripDays");
	let otherDateContolName = sender.params.name == "dateSince" ? "dateTill" : "dateSince";
	let otherDateContol = layout.controls.tryGet<DateTimePicker>(otherDateContolName);
	if (!tripDaysContol || !otherDateContol) return;

	tripDaysContol.value = getDateDifference(sender, otherDateContol);
}

function getDateDifference(sender: DateTimePicker, otherDateContol: DateTimePicker) {
	let senderDate = sender.value;
	let otherDate = otherDateContol.value;
	let senderDateOnly = senderDate.setHours(0, 0, 0, 0);
	let otherDateOnly = otherDate.setHours(0, 0, 0, 0);
	let milliseconds = Math.abs(senderDateOnly - otherDateOnly);
	let millisecondsPerDay = 1000 * 60 * 60 * 24;
	return Math.floor(milliseconds / millisecondsPerDay) + 1;
}

//В разметке на «чтение»: добавить на ленту кнопку, по нажатию на кнопку 
//выводить сообщение (MessageBox.ShowInfo) с краткой информацией по заявке: 
//«Номер заявки», «Дата создания», «Даты командировки С:», «по:», «Основание для поездки».
export async function shortInfo_click(sender: CustomButton) {
	let layout = sender.layout;
	let numberControl = layout.controls.tryGet<Numerator>("applicationNumber");
	let crDateControl = layout.controls.tryGet<DateTimePicker>("date");
	let sinceContol = layout.controls.tryGet<DateTimePicker>("dateSince");
	let tillContol = layout.controls.tryGet<DateTimePicker>("dateTill");
	let reasonControl = layout.controls.tryGet<TextArea>("reason");
	if (!numberControl || !crDateControl || !sinceContol || !tillContol || !reasonControl) return;

	MessageBox.ShowInfo(
		"Номер заявки: {0}\n".format(numberControl.hasValue() ? numberControl.value.number : "не задано")
		+ "Дата создания: {0}\n".format(crDateControl.hasValue() ? crDateControl.value.toLocaleDateString() : "не задано")
		+ "Даты командировки С: {0} ".format(sinceContol.hasValue() ? sinceContol.value.toLocaleDateString() : "не задано")
		+ "по: {0}\n".format(tillContol.hasValue() ? tillContol.value.toLocaleDateString() : "не задано")
		+ "Основание для поездки: {0}".format(reasonControl.hasValue() ? reasonControl.value.toString() : "не задано")
	);
}

//#region отмена сохранения, не работает
//!!! root имеет событие Подготовка к сохранению карточки

//В разметке на «редактирование»: перед сохранением карточки проверить, что заполнен элемент 
//«Номер заявки» и «Название», если он пустой, выдавать предупреждение и отменять сохранение.
export async function savingButtons_beforeClick(sender: SavingButtons, e: ISavingButtonClickEventArgs) {
	let layout = sender.layout;
	let numberControl = layout.controls.tryGet<Numerator>("applicationNumber");
	let nameControl = layout.controls.tryGet<TextBox>("name");

	let savingBtnContol = layout.controls.tryGet<SavingButtons>("savingButtons");

	if (!numberControl || !nameControl) return;

	if (!numberControl.hasValue() || !nameControl.hasValue()) {
		MessageBox.ShowInfo("Поля \"Номер заявки\" и \"Название\" должны быть заполнены");
		// sender.performCancel();
		savingBtnContol.performCancel();
		return;
	}

	// sender.performSave();
	savingBtnContol.performSave();
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
export async function employeeToSend_ChangeData(sender: Employee) {
	let layout = sender.layout;
	let managerControl = layout.controls.tryGet<Employee>("supervisor");
	let phoneControl = layout.controls.tryGet<TextBox>("phoneNumber");
	if (!managerControl || !phoneControl) return;

	if (sender.hasValue()) {
		let customEmplService = layout.getService($CustomEmployeeDataController);
		let model = await customEmplService.GetEmployeeData(sender.params.value.id);
		if (model) {
			managerControl.params.value = model.manager;
			phoneControl.params.value = model.phone;
			return;
		}
	}
	managerControl.params.value = null;
	phoneControl.params.value = null;
}

export async function elementsLoadedEdit() {
	await fillWhoArranges();
}

export async function elementsLoadedView() {
	SetToApprovingButtonCanClick();
}

// В разметке на «редактирование»: при первом открытии карточки в поле «Кто оформляет» 
//должны вписываться сотрудники из группы справочника сотрудников - «Секретарь».
async function fillWhoArranges() {
	let layout = layoutManager.cardLayout;
	let isCreateLayout = layout.layoutInfo.action = GenModels.LayoutAction.Create;
	if (!isCreateLayout) return;

	let managerControl = layout.controls.tryGet<MultipleEmployees>("whoArranges");
	if (!managerControl) return;
	let service = layout.getService($CustomEmployeeDataController);
	let model = await service.GetEmployeesFromGroup("Секретарь");
	if (model) {
		managerControl.params.value = model.employees;
	}
}

//В разметке на «редактирование»: при выборе значения в поле «Город», необходимо получить значение 
//из этого элемента справочника (мы его создавали ранее, поле «Суточные») и вписать в поле 
//«Сумма командировочных», рассчитав по следующей формуле: 
//«Суточные» * значение в поле «Кол-во дней в командировке».
export async function city_ChangeData(sender: DirectoryDesignerRow) {
	let layout = sender.layout;
	let tripDaysContol = layout.controls.tryGet<NumberControl>("tripDays");
	let expensesContol = layout.controls.tryGet<NumberControl>("expenses");
	if (!tripDaysContol || !expensesContol) return;
	if (!tripDaysContol.hasValue()) return;

	if (sender.hasValue()) {
		let service = layout.getService($CustomCityDataController);
		let model = await service.GetCityData(sender.params.value.id);
		if (model) {
			expensesContol.params.value = parseFloat(model.dailyAllowance) * tripDaysContol.value;
			return;
		}
	}
	expensesContol.params.value = null;
}

// В разметке на «чтение»: добавить кнопку на форму карточки, переводящую карточку в состояние 
// «На согласование» и доступна только в состоянии «Проект».
export async function toApproving_Click(sender: CustomButton) {
	let layout = sender.layout;
	let stateContol = layout.controls.tryGet<State>("state");
	if (stateContol == null) return;
	let service = layout.getService($CustomApprovingStageOperationDataController);
	let model = await service.GetApprovingStageOperationData(layout.cardInfo.id, "ToApproving");
	stateContol.reloadFromServer();

	SetToApprovingButtonCanClick();
}

function SetToApprovingButtonCanClick() {
	let layout = layoutManager.cardLayout;
	let toApprovingControl = layout.controls.tryGet<CustomButton>("toApproving");
	let state = layout.controls.tryGet<State>("state");
	if (!toApprovingControl || !state) return;

	let isStateProject = state.params.value.caption == "Проект";
	let isView = layout.layoutInfo.action == GenModels.LayoutAction.View;
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
// записанная в контрол «Стоимость билетов» (его необходимо так же добавить, по аналогии с толстым клиентом).
// export async function getTicketCosts_Click(sender: CustomButton) {
// 	let layout = sender.layout;
// 	let ticketsCostControl = layout.controls.tryGet<NumberControl>("ticketsCost");
// 	if (!ticketsCostControl) return;
// 	let service = layout.getService($CustomTicketsCostDataController);
// 	let departureIATA = null;
// 	let departureDate = null;
// 	let destinationDate = null;
// 	let model = service.GetTicketsCostData(departureIATA, departureDate, destinationDate);



// }
