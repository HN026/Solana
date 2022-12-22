import { ok } from 'assert';
import { web3,Provider,setProvider,workspace,BN } from '@project-serum/anchor';
const { systemProgram } = web3;

describe('mycalculatordapp', () => {
   
   const provider = anchor.Provider.local();
   anchor.setProvider(provider);

   const calculator = web3.keypair.generate();
   const program = workspace.Mycalculatordapp;
   
   it('Creates a calculator', async () => {
      await program.rpc.create("Welcome to Solana", {
         accounts: {
            calculator: calculator.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: systemProgram.programId,
         },
         signers: [calculator]
      });

      const account = await program.account.calculator.fetch(calculator.publicKey);
      ok(account.greeting === "Welcome to Solana");
      const _calculator = calculator;
   });

   it('Adds two numbers', async function(){
      const calculator = _calculator;
      
      await program.rpc.add(new BN(2), new BN(3), {
         accounts:{
            calculator: calculator.publicKey,
         },
      });

      const account = await program.account.calculator.fetch(calculator.publicKey);
      ok(account.result.eq(new BN(5)));
      ok(account.greeting === "Welcome to Solana");   
   });

   it('Multiplies two numbers', async function(){
      const calculator = _calculator;
      
      await program.rpc.multiply(new BN(2), new BN(3), {
         accounts:{
            calculator: calculator.publicKey,
         },
      });
      
      const account = await program.account.calculator.fetch(calculator.publicKey);
      ok(account.result.eq(new BN(6)));
      ok(account.greeting === "Welcome to Solana");
   });

   it('Subtracts two numbers', async function(){
     const calculator = _calculator;

     await program.rpc.multiply(new BN(3), new BN(2), {
      accounts: {
         calculator: calculator.publicKey,
      },
     });

      const account = await program.account.fetch(calculator.publicKey);
      ok(account.result.eq(new BN(1)));
      ok(account.greeting === "Welcome to Solana");

   });

   it('Divides two numbers', async function(){
      const calculator = _calculator;

      await program.rpc.divide(new BN(3), new BN(2), {
         accounts: {
            calculator: calculator.publicKey,
         },
      });

      const account = await program.account.fetch(calculator.publicKey);
      ok(account.result.eq(new BN(1)));
      ok(account.remainder.eq(new BN(1)));
      ok(account.greeting === "Welcome to Solana");
   });
});