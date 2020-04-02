/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import {HEndpointGroup, HErrorStatusCode, HRequest, HResponse} from "@element-ts/hydrogen";
import {Recording, RecordingProps} from "../objects/Recording";
import {SiQuery} from "@element-ts/silicon";
import {Part, PartProps} from "../objects/Part";

export const endpointRecording: HEndpointGroup = new HEndpointGroup();

/**
 * Retrieve information for a specific recording.
 */
endpointRecording.getDynamic(async(req: HRequest, res: HResponse): Promise<void> => {

	const key: string = req.getEndpoint().toUpperCase();
	const recordingQuery: SiQuery<Recording, RecordingProps> = new SiQuery<Recording, RecordingProps>(Recording, {key});
	const recording: Recording | undefined = await recordingQuery.getFirst();
	if (recording === undefined) return res.err(HErrorStatusCode.NotFound, "Recording does not exist.");
	const partsQuery: SiQuery<Part, PartProps> = new SiQuery<Part, PartProps>(Part, {recordingId: recording.getId()});
	const parts: Part[] = await partsQuery.getAll();
	const formattedParts: object[] = [];
	for (const part of parts) formattedParts.push(part.bond());

	res.send({
		recording: recording.bond(),
		parts: formattedParts
	});

});
