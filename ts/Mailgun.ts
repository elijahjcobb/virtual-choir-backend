/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import {NodeMailgun} from "ts-mailgun/ts-mailgun";
import * as Path from "path";
import * as FS from "fs";

export class Mailgun {

	public static async send(to: string, subject: string, body: string): Promise<void> {

		const mailer: NodeMailgun = new NodeMailgun();

		mailer.apiKey = FS.readFileSync(Path.resolve("./mailgun-key.txt")).toString("utf8").replace("\n", "");
		mailer.domain = "nmcvirtualchoir.com";
		mailer.fromEmail = "no-reply@nmcvirtualchoir.com";
		mailer.fromTitle = "NMC Virtual Choir";
		mailer.init();

		await mailer.send(to, subject, body);

	}

}