import { Employee } from "@docsvision/webclient/BackOffice/Employee";
import { findStaffSection } from "@docsvision/webclient/BackOffice/FindStaffSection";
import { MultipleEmployees } from "@docsvision/webclient/BackOffice/MultipleEmployees";
import { Numerator } from "@docsvision/webclient/BackOffice/Numerator";
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
import { ICancelableEventArgs } from "@docsvision/webclient/System/ICancelableEventArgs";
import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";
import { Layout, SaveControlDataModelEventArgs } from "@docsvision/webclient/System/Layout";
//import { ISaveControlData } from "@docsvision/webclient/Legacy/LegacyModels";
import { layoutManager } from "@docsvision/webclient/System/LayoutManager";
import { func } from "prop-types";
import { $CustomEmployeeDataController } from "../Controllers/CustomEmployeeDataController";

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
	return Math.floor(milliseconds / millisecondsPerDay);
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

export async function EditLayout_CardActivated() {
	// if (!e.ActivateFlags.HasFlag(ActivateFlags.New)) return;

	// ILayoutPropertyItem arrangerControl = CustomizableControl.FindPropertyItem<ILayoutPropertyItem>("WhoArranges");
	// if (arrangerControl == null) return;
	// IStaffService staffService = ObjContext.GetService<IStaffService>();
	// StaffGroup secretaryGroup = staffService.FindGroupByName(null, "Секретарь");
	// StaffGroupItem secretary = secretaryGroup.GroupItems.FirstOrDefault();
	// arrangerControl.ControlValue = secretaryGroup.EmployeesIds.ToArray();

	let layout = layoutManager.cardLayout;
	let isCreateLayout = layout.layoutInfo.action == 2; // View: = 0 Edit: = 1 Create: = 2
	if (!isCreateLayout) return;

	let managerControl = layout.controls.tryGet<MultipleEmployees>("whoArranges");
	if (!managerControl) return;
	let service = layout.getService($CustomEmployeeDataController);	//ссылка не указывает на экз. объекта
	
	let model = await service.GetEmployeesFromGroup("Секретарь");
	if (model){
		managerControl.params.value = model.employees;
	}
	
	let a = 0;
}