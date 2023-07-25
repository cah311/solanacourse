import * as borsh from "@project-serum/borsh";
const BN = require("bn.js");

var a = new BN("737498 ", 10);

const equipPlayerSchema = borsh.struct([
  borsh.u8("variant"),
  borsh.u16("playerId"),
  borsh.u128("itemId"),
]);

const buffer = Buffer.alloc(1000);
equipPlayerSchema.encode(
  { variant: 2, playerId: 1435, itemId: new BN("737498 ", 10) },
  buffer
);

const instructionBuffer = buffer.subarray(0, equipPlayerSchema.getSpan(buffer));

const endpoint = web3.clusterApiUrl("devnet");
const connection = new web3.Connection(endpoint);

const transaction = new web3.Transaction();
const instruction = new web3.TransactionInstruction({
  keys: [
    {
      pubkey: player.publicKey,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: playerInfoAccount,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
  ],
  data: instructionBuffer,
  programId: PROGRAM_ID,
});

transaction.add(instruction);

web3
  .sendAndConfirmTransaction(connection, transaction, [player])
  .then((txid) => {
    console.log(
      `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
    );
  });
