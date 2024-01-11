import { assertNotNull } from "@subsquid/util-internal";
import * as ss58 from "@subsquid/ss58";
import { lookupArchive } from "@subsquid/archive-registry";
import {
  BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
  Event as _Event,
  Call as _Call,
  Extrinsic as _Extrinsic,
} from "@subsquid/substrate-processor";

export const SS58_NETWORK = "substrate"; // used for the ss58 prefix, aleph zero uses substrate prefix

const CONTRACT_ADDRESS_SS58 =
  "5CTQBfBC9SfdrCDBJdfLiyW2pg9z5W6C6Es8sK313BLnFgDf";
export const CONTRACT_ADDRESS = ss58
  .codec(SS58_NETWORK)
  .decode(CONTRACT_ADDRESS_SS58);

export const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("aleph-zero", { release: "ArrowSquid" }),
    chain: {
      url: assertNotNull(process.env.RPC_ENDPOINT),
      rateLimit: 10,
    },
  })
  .addContractsContractEmitted({
    contractAddress: [CONTRACT_ADDRESS],
    extrinsic: true,
  })
  .setFields({
    block: {
      timestamp: true,
    },
    extrinsic: {
      hash: true,
    },
  })
  .setBlockRange({
    // genesis block happens to not have a timestamp, so it's easier
    // to start from 1 in cases when the deployment height is unknown
    from: 55439804,
  });

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
