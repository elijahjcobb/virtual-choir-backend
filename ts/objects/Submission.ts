/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import {SiObject} from "@element-ts/silicon";
import {Config} from "../Config";
/**
 * The type definition for a Submission's prop object.
 */
export interface SubmissionProps {
	firstName: string;
	lastName: string;
	organization: string;
	email: string;
	emailVerification: string;
	recordingId: string;
	partId: string;
	hasVerified: boolean;
}

/**
 * A class representing a Submission built with @element-ts/silicon.
 */
export class Submission extends SiObject<SubmissionProps> {

	/**
	 * Create a new Submission instance.
	 */
	public constructor() {

		super("submission");

	}

	public getVideoPath(): string {

		return `${Config.submissionPath()}/${this.getId()}.mp4`;

	}

}