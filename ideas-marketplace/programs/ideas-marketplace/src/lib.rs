use anchor_lang::prelude::*;

mod instructions;
mod data;

use instructions::*;

declare_id!("svvdP8aiFfFhP2HhWKkLtvvqEKaGQ3rgcvN567v3gRf");

#[program]
pub mod ideas_marketplace {
    use super::*;

    pub fn create_idea(ctx: Context<CreateIdea>, title: String, description: String, price: u64) -> Result<()> {
        create_idea::create_idea(ctx, title, description, price)
    }

    pub fn transfer_idea(ctx: Context<TransferIdea>) -> Result<()> {
        transfer_idea::transfer_idea(ctx)
    }
}
