import { BaseControl, BaseControlParams, BaseControlState } from "@docsvision/webclient/System/BaseControl";
import { SomeControlImpl, ISomeControlState } from "./SomeControlImpl";
import { rw } from "@docsvision/webclient/System/Readwrite";

export class SomeControlParams extends BaseControlParams {
    @rw id?: string;
    @rw someParam: string;
}

export class SomeControl extends BaseControl<SomeControlParams, ISomeControlState> {
    protected createParams(): SomeControlParams {
        return new SomeControlParams();
    }

    protected createImpl() {
        return new SomeControlImpl(this.props, this.state);
    }
}