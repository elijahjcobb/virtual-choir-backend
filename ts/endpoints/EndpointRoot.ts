/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import {HEndpointGroup} from "@element-ts/hydrogen";
import {endpointRecording} from "./EndpointRecording";
import {endpointSubmission} from "./EndpointSubmission";
import {endpointPart} from "./EndpointPart";
import {endpointAdmin} from "./EndpointAdmin";

export const endpointRoot: HEndpointGroup = new HEndpointGroup();

endpointRoot.attach("/recording", endpointRecording);
endpointRoot.attach("/submission", endpointSubmission);
endpointRoot.attach("/part", endpointPart);
endpointRoot.attach("/admin", endpointAdmin);