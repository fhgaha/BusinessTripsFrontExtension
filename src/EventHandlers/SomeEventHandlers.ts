import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { NumberControl } from "@docsvision/webclient/Platform/Number";
import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";
import { Layout } from "@docsvision/webclient/System/Layout";
import { layoutManager } from "@docsvision/webclient/System/LayoutManager";
import { func } from "prop-types";

//В разметке на «редактирование»: при изменении контролов «Даты командировки С:» или «по:» 
//и, если заполнены оба поля необходимо рассчитать кол-во дней в командировке и записать 
//в поле «Кол-во дней в командировке».
export async function dateSince_ChangeData(sender: DateTimePicker) {
	await SetTripDaysValue(sender);
}

export async function dateTill_ChangeData(sender: DateTimePicker) {
	await SetTripDaysValue(sender);
}

async function SetTripDaysValue(sender: DateTimePicker) {
	let layout = sender.layout;
	let tripDaysContol = layout.controls.tryGet<NumberControl>("tripDays");
	let otherDateContolName = sender.params.name == "dateSince" ? "dateTill" : "dateSince";
	let otherDateContol = layout.controls.tryGet<DateTimePicker>(otherDateContolName);

	tripDaysContol.value = GetDateDifference(sender, otherDateContol);
}

function GetDateDifference(sender: DateTimePicker, otherDateContol: DateTimePicker) {
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


