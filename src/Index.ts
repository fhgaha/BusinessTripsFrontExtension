import * as SomeEventHandlers from "./EventHandlers/SomeEventHandlers";
import { extensionManager } from "@docsvision/webclient/System/ExtensionManager";
import { Service } from "@docsvision/webclient/System/Service";
import { $CustomEmployeeDataController, CustomEmployeeDataController } from "./Controllers/CustomEmployeeDataController";
import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { $CustomCityDataController, CustomCityDataController } from "./Controllers/CustomCityDataController";
import { $CustomOperationDataController, CustomOperationDataController } from "./Controllers/CustomOperationDataController";

// Главная входная точка всего расширения
// Данный файл должен импортировать прямо или косвенно все остальные файлы, 
// чтобы rollup смог собрать их все в один бандл.

// Регистрация расширения позволяет корректно установить все
// обработчики событий, сервисы и прочие сущности web-приложения.
extensionManager.registerExtension({
    name: "Business Trip Front Extension",
    version: "1.0.0",
    globalEventHandlers: [ SomeEventHandlers ],
    layoutServices: [
        Service.fromFactory(
            $CustomEmployeeDataController,
            (services: $RequestManager) => new CustomEmployeeDataController(services)
        ),
        Service.fromFactory(
            $CustomCityDataController,
            (services: $RequestManager) => new CustomCityDataController(services)
        ),
        Service.fromFactory(
            $CustomOperationDataController,
            (services: $RequestManager) => new CustomOperationDataController(services)
        ),
    ]
})
