import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import * as fs from "fs";

async function main() {
  const secret = JSON.parse(
    fs.readFileSync("ephkey.json").toString()
  ) as number[];
  const secretKey = Uint8Array.from(secret);
  const ownerKeypair = Keypair.fromSecretKey(secretKey);

  const publicKey = ownerKeypair.publicKey;
  console.log(publicKey.toBase58());

  const transaction = new Transaction();

  const recipient = new PublicKey(
    "5GM7bGqub4vzPQsBfkbAiQJEJbC4sehAcWowx4Yc5FeM"
  );

  const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: ownerKeypair.publicKey,
    toPubkey: recipient,
    lamports: LAMPORTS_PER_SOL * 0.1,
  });

  transaction.add(sendSolInstruction);

  const connection = new Connection(clusterApiUrl("devnet"));

  const lamports = BigInt(LAMPORTS_PER_SOL * 0.1);
  const instructionData: Buffer = Buffer.alloc(4 + 8);
  instructionData.writeUInt32LE(2, 0);
  instructionData.writeBigUInt64LE(lamports, 4);

  //   const airdropSignature = await connection.requestAirdrop(
  //     ownerKeypair.publicKey,
  //     1 * LAMPORTS_PER_SOL
  //   );

  const manualInstruction = new TransactionInstruction({
    keys: [
      {
        pubkey: ownerKeypair.publicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: recipient,
        isSigner: false,
        isWritable: true,
      },
    ],
    programId: SystemProgram.programId,
    data: instructionData,
  });
  transaction.add(manualInstruction);

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    ownerKeypair,
  ]);

  console.log(signature);
}

main();
