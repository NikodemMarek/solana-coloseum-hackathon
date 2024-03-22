use anchor_lang::prelude::*;

mod instructions;
use instructions::*;

declare_id!("8MNVJRrQSFdZxJmLcwpZG4MKHKWkHvsLDpuMeZswEtkV");

#[program]
pub mod ideas_marketplace {
    use super::*;

    pub fn create_idea(ctx: Context<CreateIdea>, title: String, description: String) -> Result<()> {
        create::create_idea(ctx, title, description)
    }

    pub fn create_mint(ctx: Context<CreateMint>) -> Result<()> {
        create_token::create_mint(ctx)
    }
}
