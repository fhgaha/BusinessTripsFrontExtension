import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { serviceName } from "@docsvision/webclient/System/ServiceUtils";
import { urlStore } from "@docsvision/webclient/System/UrlStore";
import { ICustomCityData } from "../Models/ICustomCityData";

export class CustomCityDataController {
	constructor(private services: $RequestManager) { }

	public GetCityData(cityId: string): Promise<ICustomCityData> {
		let url = urlStore.urlResolver.resolveUrl("GetCustomCityData", "CustomCityData");
		let data = { cityId: cityId }
		return this.services.requestManager.post(url, JSON.stringify(data));
	}
}

export type $CustomCityDataController = { CustomCityDataController: CustomCityDataController }
export const $CustomCityDataController = serviceName(
	(s: $CustomCityDataController) => s.CustomCityDataController
)