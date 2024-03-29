use anchor_lang::prelude::*;

use crate::data::Idea;

#[derive(Accounts)]
pub struct SetIdeaIsForSale<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(mut)]
    pub idea: Account<'info, Idea>,

    pub system_program: Program<'info, System>,
}

pub fn set_idea_is_for_sale(ctx: Context<SetIdeaIsForSale>, is_for_sale: bool) -> Result<()> {
    ctx.accounts.idea.is_for_sale = is_for_sale;

    Ok(())
}
