use anchor_lang::prelude::*;

use crate::data::Idea;

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateIdea<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: The owner does not need to give permission to create the idea.
    #[account(mut)]
    pub creator: AccountInfo<'info>,

    #[account(
        init,
        payer = payer,
        space = 1 + 8 + Idea::SIZE,
        seeds = [b"idea", title.as_bytes(), creator.key().as_ref()],
        bump,
    )]
    pub idea: Account<'info, Idea>,

    pub system_program: Program<'info, System>,
}

pub fn create_idea(ctx: Context<CreateIdea>, title: String, description: String, price: u64, is_for_sale: bool) -> Result<()> {
    msg!("a");
    ctx.accounts.idea.owner = ctx.accounts.creator.key();
    ctx.accounts.idea.title = title;
    ctx.accounts.idea.description = description;
    ctx.accounts.idea.price = price;
    ctx.accounts.idea.is_for_sale = is_for_sale;
    msg!("b");

    Ok(())
}
