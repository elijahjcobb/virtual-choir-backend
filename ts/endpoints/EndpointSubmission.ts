/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import {HEndpointGroup, HErrorStatusCode, HRequest, HResponse, HUploadManagerLocation} from "@element-ts/hydrogen";
import {StandardType} from "typit";
import * as FS from "fs";
import {Submission} from "../objects/Submission";
import * as Crypto from "crypto";
import {Mailgun} from "../Mailgun";
import {SiQuery} from "@element-ts/silicon";
import {Recording, RecordingProps} from "../objects/Recording";

export const endpointSubmission: HEndpointGroup = new HEndpointGroup();

/**
 * Upload information regarding a submission user and get a submission id.
 */
endpointSubmission.post("/", {
	types: {
		firstName: StandardType.STRING,
		lastName: StandardType.STRING,
		email: StandardType.STRING,
		organization: StandardType.STRING,
		recordingKey: StandardType.STRING
	},
	handler: async(req: HRequest, res: HResponse): Promise<void> => {

		const body: {firstName: string, lastName: string, email: string, organization: string, recordingKey: string} = req.getBody();
		body.recordingKey = body.recordingKey.toUpperCase();

		if (!body.email.match(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/)) return res.err(HErrorStatusCode.NotAcceptable, "Email invalid.");

		const query: SiQuery<Recording, RecordingProps> = new SiQuery<Recording, RecordingProps>(Recording, {
			key: body.recordingKey
		});
		const recording: Recording | undefined = await query.getFirst();
		if (recording === undefined) return res.err(HErrorStatusCode.NotFound, "Recording does not exist.");

		const submission: Submission = new Submission();
		submission.props.firstName = body.firstName;
		submission.props.lastName = body.lastName;
		submission.props.email = body.email;
		submission.props.organization = body.organization;
		submission.props.emailVerification = Crypto.randomBytes(3).toString("hex").toUpperCase();
		submission.props.recordingId = recording.getId();
		submission.props.hasVerified = false;


		await Mailgun.send(submission.props.email, "NMC Virtual Choir Verification", `Hello ${submission.props.firstName},<br><br>Your verification code for ${recording.props.name ?? "your new recording"} is <code>${submission.props.emailVerification}</code>.<br><br>Thanks,\nThe NMC Virtual Choir Team`);
		await submission.create();

		res.send({submissionId: submission.getId()});

	}
});


/**
 * Verify the email of a submission user.
 */
endpointSubmission.post("/verify", {
	types: {
		submissionId: StandardType.STRING,
		verificationCode: StandardType.STRING
	},
	handler: async(req: HRequest, res: HResponse): Promise<void> => {

		const body: {submissionId: string, verificationCode: string} = req.getBody();
		body.verificationCode = body.verificationCode.toUpperCase();
		console.log(body);

		const submission: Submission | undefined = await SiQuery.getObjectForId(Submission, body.submissionId);
		console.log("got submission!");
		console.log(submission);
		if (!submission || submission.props.emailVerification === undefined) return res.err(404, "You must first call 'POST /submission'.");
		if (submission.props.emailVerification.toUpperCase() !== body.verificationCode) return res.err(HErrorStatusCode.NotAcceptable, "The verification code you supplied is not valid.");

		submission.props.hasVerified = true;
		console.log("will update");
		await submission.update("hasVerified");
		console.log("did update");

		res.setStatusCode(200);
		res.send({"msg": "verified", submissionId: submission.getId()});

	}
});


/**
 * Get video submission.
 */
endpointSubmission.post("/video", {
	upload: {
		sizeLimit: 500_000_000,
		location: HUploadManagerLocation.STREAM,
		extensions: ["mp4"]
	},
	handler: async(req: HRequest, res: HResponse): Promise<void> => {

		const submissionId: string | undefined = req.getHeaders()["submissionId"] as (string | undefined);
		if (submissionId === undefined) return res.err(HErrorStatusCode.BadRequest, "You must supply a 'submissionId' header.");
		const submission: Submission | undefined = await SiQuery.getObjectForId(Submission, submissionId);
		if (submission === undefined) return res.err(404, "Submission does not exist.");
		if (submission.props.hasVerified !== true) return res.err(401, "You must verify your email first.");

		const readStream: FS.ReadStream | undefined = req.getPayloadStream();
		if (readStream === undefined) return res.err(500, "Read stream is not defined.");
		const writeStream: FS.WriteStream = FS.createWriteStream(submission.getVideoPath());

		readStream.pipe(writeStream);

		if (submission.props.recordingId === undefined) return res.err(500, "Recording id is undefined.");
		const recording: Recording | undefined = await SiQuery.getObjectForId(Recording, submission.props.recordingId);

		if (submission.props.email === undefined) return;
		if (recording === undefined) return res.err(500, "Recording is undefined.");
		if (recording.props.name === undefined) return;
		await Mailgun.send(submission.props.email, "Video Submitted", `Hello ${submission.props.firstName},\n\nYour video for '${recording.props.name}' was submitted successfully.\n\nThanks,\nThe NMC Virtual Choir Team`);

		res.send({msg: "Uploaded."});

	}
});