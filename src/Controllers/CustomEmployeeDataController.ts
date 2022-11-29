import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { serviceName } from "@docsvision/webclient/System/ServiceUtils";
import { urlStore } from "@docsvision/webclient/System/UrlStore";
import { ICustomEmployeeData } from "../Models/ICustomEmployeeData";
import { ICustomEmployeeModelsData } from "../Models/ICustomEmployeeModelsData";

export class CustomEmployeeDataController {
	constructor(private services: $RequestManager) { }

	public GetEmployeeData(employeeId: string): Promise<ICustomEmployeeData> {
		let url = urlStore.urlResolver.resolveUrl("GetCustomEmployeeData", "CustomEmployeeData");
		let data = { employeeId: employeeId }
		return this.services.requestManager.post(url, JSON.stringify(data));
	}

	public GetEmployeesFromGroup(groupName: string) : Promise<ICustomEmployeeModelsData>{
		let url = urlStore.urlResolver.resolveUrl("GetCustomEmployeesFromGroup", "CustomEmployeeData");
		let data = { groupName: groupName }
		return this.services.requestManager.post(url, JSON.stringify(data));
	}
}

export type $CustomEmployeeDataController = { CustomEmployeeDataController: CustomEmployeeDataController }
export const $CustomEmployeeDataController = serviceName(
	(s: $CustomEmployeeDataController) => s.CustomEmployeeDataController
)