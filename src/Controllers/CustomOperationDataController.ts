import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { serviceName } from "@docsvision/webclient/System/ServiceUtils";
import { urlStore } from "@docsvision/webclient/System/UrlStore";
import { ICustomOperationData } from "../Models/ICustomOperationData";

export class CustomApprovingStageOperationDataController {
	constructor(private services: $RequestManager) { }

	public GetApprovingStageOperationData(cardId: string, approvalStageName: string) : Promise<ICustomOperationData> {
		let url = urlStore.urlResolver.resolveUrl(
			"GetCustomApprovingStageOperationData", "CustomApprovingStageOperationData");
		let data = { cardId: cardId, approvalStageName: approvalStageName }
		return this.services.requestManager.post(url, JSON.stringify(data));
	}
}

export type $CustomApprovingStageOperationDataController = { 
	CustomApprovingStageOperationDataController: CustomApprovingStageOperationDataController }
export const $CustomApprovingStageOperationDataController = serviceName(
	(s: $CustomApprovingStageOperationDataController) => s.CustomApprovingStageOperationDataController
)