import { createAccount, createMint } from "@solana/spl-token";
import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
const fs = require("fs");

function loadKeypair(filename: string): Keypair {
  const secret = JSON.parse(fs.readFileSync(filename).toString()) as number[];
  const secretKey = Uint8Array.from(secret);
  return Keypair.fromSecretKey(secretKey);
}

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));

  const payer = loadKeypair(
    "CarCpGmuLkKrku1ba24V7htzAt2fcHevEHKueFdsz4Tb.json"
  );
  const tokenKeypair = loadKeypair(
    "LogSxbttM5VKKkwh2gFqJU9tgPUBRv5Uqvee8FdaPWj.json"
  );
  const tokenAccountKeypair = loadKeypair(
    "LarWgSXpScMfPMJ3PurLahJAmYM3jPQU2qYTpnrHHnb.json"
  );

  //   const tokenMintAddress = await createMint(
  //     connection,
  //     payer,
  //     payer.publicKey,
  //     payer.publicKey,
  //     9,
  //     tokenKeypair
  //   );
  //   console.log(tokenMintAddress.toBase58());

  const ta = await createAccount(
    connection,
    payer,
    tokenKeypair.publicKey,
    payer.publicKey,
    tokenAccountKeypair
  );

  console.log(ta.toBase58());
}

main();
