/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import {HHTTPServer} from "@element-ts/hydrogen";
import {SiDatabase} from "@element-ts/silicon";
import {endpointRoot} from "./endpoints/EndpointRoot";

(async(): Promise<void> => {

	await SiDatabase.init({
		address: "mongodb://localhost:27017",
		database: "VirtualChoir",
		verbose: true
	});

	const server: HHTTPServer = new HHTTPServer(endpointRoot);
	server.start(4001);

})().catch((e: any): void => console.error(e));

