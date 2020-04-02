/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import {HEndpointGroup, HErrorStatusCode, HRequest, HResponse} from "@element-ts/hydrogen";
import {Recording} from "../objects/Recording";
import {SiQuery} from "@element-ts/silicon";
import {Submission} from "../objects/Submission";
import {Part, PartProps} from "../objects/Part";

export const endpointRecording: HEndpointGroup = new HEndpointGroup();

/**
 * Retrieve information for a specific recording.
 */
endpointRecording.getDynamic(async(req: HRequest, res: HResponse): Promise<void> => {

	const submissionId: string = req.getEndpoint();
	const submission: Submission | undefined = await SiQuery.getObjectForId(Submission, submissionId);
	if (submission === undefined) return res.err(HErrorStatusCode.NotAcceptable, "Submission does not exist. Call 'POST /submission' first.");
	if (submission.props.hasVerified !== true) return res.err(HErrorStatusCode.NotAcceptable, "Submission not verified, call 'POST /submission/verify' first.");
	if (submission.props.recordingId === undefined) return res.err(HErrorStatusCode.NotAcceptable, "Submission's recordingId is undefined.");
 	const recording: Recording | undefined = await SiQuery.getObjectForId(Recording, submission.props.recordingId);
	if (!recording) return res.err(HErrorStatusCode.NotFound, "The recording specified could not be found.");

	const query: SiQuery<Part, PartProps> = new SiQuery<Part, PartProps>(Part, {
		recordingId: submission.props.recordingId
	});

	const parts: Part[] = await query.getAll();
	const formattedParts: object[] = [];
	for (const part of parts) formattedParts.push(part.bond());

	res.send({
		recording: recording.bond(),
		parts: formattedParts
	});

});
