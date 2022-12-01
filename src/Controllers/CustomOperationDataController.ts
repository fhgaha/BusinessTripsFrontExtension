import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { serviceName } from "@docsvision/webclient/System/ServiceUtils";
import { urlStore } from "@docsvision/webclient/System/UrlStore";
import { ICustomOperationData } from "../Models/ICustomOperationData";

export class CustomOperationDataController {
	constructor(private services: $RequestManager) { }

	public GetOperationData(cardId: string, endStateName: string): Promise<ICustomOperationData> {
		let url = urlStore.urlResolver.resolveUrl("GetCustomOperationData", "CustomOperationData");
		let data = { cardId: cardId, endStateName: endStateName }
		return this.services.requestManager.post(url, JSON.stringify(data));
	}
}

export type $CustomOperationDataController = { CustomOperationDataController: CustomOperationDataController }
export const $CustomOperationDataController = serviceName(
	(s: $CustomOperationDataController) => s.CustomOperationDataController
)