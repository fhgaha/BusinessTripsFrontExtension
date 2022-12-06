import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { serviceName } from "@docsvision/webclient/System/ServiceUtils";
import { urlStore } from "@docsvision/webclient/System/UrlStore";
import { ICustomTicketsCostData } from "../Models/ICustomTicketsCostData";

export class CustomTicketsCostDataController {
	constructor(private services: $RequestManager) { }

	public GetTicketsCostData(destinationId: string, departureDate: Date, destinationDate: Date)
	: Promise<ICustomTicketsCostData> {
		let url = urlStore.urlResolver.resolveUrl("GetCustomTicketsCostData", "CustomTicketsCostData");
		let data = { destinationId: destinationId, departureDate: departureDate, destinationDate: destinationDate };
		let result = this.services.requestManager.post<ICustomTicketsCostData>(url, JSON.stringify(data));
		return result;
	}
}

export type $CustomTicketsCostDataController = { CustomTicketsCostDataController: CustomTicketsCostDataController }
export const $CustomTicketsCostDataController = serviceName(
	(s: $CustomTicketsCostDataController) => s.CustomTicketsCostDataController
)
