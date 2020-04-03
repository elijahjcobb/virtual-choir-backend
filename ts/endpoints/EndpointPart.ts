/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import {HEndpointGroup, HErrorStatusCode, HFileSendType, HRequest, HResponse} from "@element-ts/hydrogen";
import {Part, PartProps} from "../objects/Part";
import {SiQuery} from "@element-ts/silicon";
import * as FS from "fs";

export const endpointPart: HEndpointGroup = new HEndpointGroup();

/**
 * Get the files for a recording part.
 */
endpointPart.getDynamic(async(req: HRequest, res: HResponse): Promise<void> => {

	const partId: string = req.getEndpoint();
	const part: Part | undefined = await SiQuery.getObjectForId(Part, partId);
	if (!part) return res.err(HErrorStatusCode.NotFound, "The specified part could not be found.");

	const previewPath: string = part.getFilePathForPreview();
	if (!FS.existsSync(previewPath)) return res.err(HErrorStatusCode.NotFound, "Could not find the specified preview file.");
	const readStream: FS.ReadStream = FS.createReadStream(previewPath);

	res.sendStream(readStream, {
		type: HFileSendType.PREVIEW,
		name: partId + ".mp4",
		mime: {
			type: "video",
			subtype: "mp4"
		}
	});

});