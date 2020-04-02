/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import {HEndpointGroup, HErrorStatusCode, HRequest, HResponse} from "@element-ts/hydrogen";
import {ArrayType, StandardType} from "typit";
import * as FS from "fs";
import * as Path from "path";
import {SiQuery} from "@element-ts/silicon";
import {Recording, RecordingProps} from "../objects/Recording";
import {Part} from "../objects/Part";

export const endpointAdmin: HEndpointGroup = new HEndpointGroup();

endpointAdmin.post("/recording", {
	types: {
		name: StandardType.STRING,
		key: StandardType.STRING,
		parts: new ArrayType(StandardType.STRING),
		password: StandardType.STRING
	},
	handler: async(req: HRequest, res: HResponse): Promise<void> => {


		const body: {name: string, key: string, parts: string[], password: string} = req.getBody();
		body.key = body.key.toUpperCase();
		let password: string = FS.readFileSync(Path.resolve("./admin-password.txt")).toString("utf8");
		password = password.replace("\n", "");

		if (body.password !== password) return res.err(HErrorStatusCode.Forbidden, "Incorrect password.");
		if (body.key.length < 4) return res.err(HErrorStatusCode.NotAcceptable, "Keys must be at least 4 characters long.");
		if (!body.key.match(/^[0-9a-zA-Z]+$/)) return res.err(HErrorStatusCode.NotAcceptable, "Keys must be only letters or numbers.");
		const query: SiQuery<Recording, RecordingProps> = new SiQuery<Recording, RecordingProps>(Recording, {
			key: body.key
		});
		if (await query.exists()) return res.err(HErrorStatusCode.NotAcceptable, "A recording already exists with this key.");

		const recording: Recording = new Recording();
		recording.props.name = body.name;
		recording.props.key = body.key;
		await recording.create();

		const partIds: string[] = [];
		for (const partName of body.parts) {

			const part: Part = new Part();
			part.props.name = partName;
			part.props.recordingId = recording.getId();
			await part.create();
			partIds.push(part.getId());

		}

		res.send({
			recordingId: recording.getId(),
			partIds: partIds
		});

	}
});