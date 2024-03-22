use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};

#[derive(Accounts)]
pub struct CreateMint<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: He does not need to give consent
    #[account(mut)]
    pub owner: UncheckedAccount<'info>,

    #[account(
        init,
        payer = payer,
        mint::authority = owner,
        mint::freeze_authority = owner,
        mint::decimals = 0,
    )]
    pub mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn create_mint(ctx: Context<CreateMint>) -> Result<()> {
    Ok(())
}
