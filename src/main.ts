import * as ss58 from "@subsquid/ss58";
import { TypeormDatabase } from "@subsquid/typeorm-store";

import * as registry from "./abi/registry";
import { Owner, Domain } from "./model";
import { processor, SS58_NETWORK, CONTRACT_ADDRESS } from "./processor";

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  const domains: Domain[] = [];
  const uniqueOwners = new Set<string>();

  for (const block of ctx.blocks) {
    for (const event of block.events) {
      if (
        event.name === "Contracts.ContractEmitted" &&
        event.args.contract === CONTRACT_ADDRESS
      ) {
        const decodedEvent = registry.decodeEvent(event.args.data);
        if (decodedEvent.__kind === "Register") {
          uniqueOwners.add(ss58.codec(SS58_NETWORK).encode(decodedEvent.from));
          domains.push(
            new Domain({
              id: decodedEvent.name,
              owner: new Owner({
                id: ss58.codec(SS58_NETWORK).encode(decodedEvent.from),
              }),
              registrationDate: new Date(
                Number(decodedEvent.registrationTimestamp)
              ),
              expirationDate: new Date(
                Number(decodedEvent.expirationTimestamp)
              ),
            })
          );
        }
      }
    }
  }

  const owners: Owner[] = Array.from(uniqueOwners).map(
    (id) => new Owner({ id: id })
  );

  await ctx.store.upsert(owners);
  await ctx.store.insert(domains);
});
