import React from "react";
import { BaseControlParams, BaseControlState } from "@docsvision/webclient/System/BaseControl";
import { BaseControlImpl } from "@docsvision/webclient/System/BaseControlImpl";
import { layoutManager } from "@docsvision/webclient/System/LayoutManager";
import { SomeControlParams } from "./SomeControl";

export interface ISomeControlState extends SomeControlParams, BaseControlState {
}

export class SomeControlImpl extends BaseControlImpl<SomeControlParams, ISomeControlState> {
    constructor(props: SomeControlParams, state: ISomeControlState) {
        super(props, state);
    }

    componentDidMount() {
    }

    protected renderControl() {
        if (layoutManager.cardLayout) {
            return (
                <div>
                    Hello world!
                </div>
            );
        }
    }
}
