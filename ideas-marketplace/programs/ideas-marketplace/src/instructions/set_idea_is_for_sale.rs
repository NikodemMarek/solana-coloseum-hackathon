use anchor_lang::prelude::*;

use crate::data::Idea;
use crate::errors::IdeaMarketplaceError;

#[derive(Accounts)]
pub struct SetIdeaIsForSale<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(mut)]
    pub idea: Account<'info, Idea>,

    pub system_program: Program<'info, System>,
}

pub fn set_idea_is_for_sale(ctx: Context<SetIdeaIsForSale>, is_for_sale: bool) -> Result<()> {
    require!(ctx.accounts.idea.owner == ctx.accounts.owner.key(), IdeaMarketplaceError::NotIdeaOwner);

    ctx.accounts.idea.is_for_sale = is_for_sale;

    Ok(())
}
