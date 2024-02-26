use anchor_lang::prelude::*;

mod instructions;
use instructions::*;

declare_id!("C7X5XbL2jjpYXopbckY6kqmqmscQfRac1cqNL68TcM4D");

#[program]
pub mod ideas_marketplace {
    use super::*;

    pub fn create_idea(ctx: Context<CreateIdea>, price: u64) -> Result<()> {
        create::create_idea(ctx, price)
    }

    // pub fn transfer_tokens(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
    //     transfer::transfer_tokens(ctx, amount)
    // }

    // pub fn create_candy_machine(ctx: Context<CreateCandyMachine>) -> Result<()> {
    //     candy_machine::create_candy_machine(ctx)
    // }
}
