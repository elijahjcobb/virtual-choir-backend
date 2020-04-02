/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import {SiObject} from "@element-ts/silicon";
import {HObject} from "@element-ts/hydrogen";
import {Config} from "../Config";

/**
 * The type definition for a Part's prop object.
 */
export interface PartProps {
	name: string;
	recordingId: string;
}

/**
 * A class representing a Part built with @element-ts/silicon.
 */
export class Part extends SiObject<PartProps> implements HObject {

	/**
	 * Create a new Part instance.
	 */
	public constructor() {

		super("part");

	}

	public getFilePathForPreview(): string {

		return `${Config.dataPath()}/${this.getId()}.mp4`;

	}

	public bond(): object {
		return {
			id: this.getId(),
			name: this.props.name,
			recordingId: this.props.recordingId,
			updatedAt: this.getUpdatedAt(),
			createdAt: this.getCreatedAt()
		};
	}

}