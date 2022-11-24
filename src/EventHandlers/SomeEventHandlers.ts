import { Numerator } from "@docsvision/webclient/BackOffice/Numerator";
import { MessageBox } from "@docsvision/webclient/Helpers/MessageBox/MessageBox";
import { CustomButton } from "@docsvision/webclient/Platform/CustomButton";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { NumberControl } from "@docsvision/webclient/Platform/Number";
import { TextArea } from "@docsvision/webclient/Platform/TextArea";
import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";
import { Layout } from "@docsvision/webclient/System/Layout";
import { layoutManager } from "@docsvision/webclient/System/LayoutManager";
import { func } from "prop-types";

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

