/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import {SiObject} from "@element-ts/silicon";
import {HObject} from "@element-ts/hydrogen";

/**
 * The type definition for a Recording's prop object.
 */
export interface RecordingProps {
	name: string;
	key: string;
}

/**
 * A class representing a Recording built with @element-ts/silicon.
 */
export class Recording extends SiObject<RecordingProps> implements HObject{

	/**
	 * Create a new Recording instance.
	 */
	public constructor() {

		super("recording");

	}

	public bond(): object {
		return {
			id: this.getId(),
			name: this.props.name,
			key: this.props.key,
			updatedAt: this.getUpdatedAt(),
			createdAt: this.getCreatedAt()
		};
	}

}