use anchor_lang::prelude::*;

#[derive(Accounts)]
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
        seeds = [b"idea", creator.key().as_ref()],
        bump,
    )]
    pub idea: Account<'info, Idea>,

    pub system_program: Program<'info, System>,
}

pub fn create_idea(ctx: Context<CreateIdea>, title: String, description: String, price: u128) -> Result<()> {
    ctx.accounts.idea.owner = ctx.accounts.creator.key();
    ctx.accounts.idea.title = title;
    ctx.accounts.idea.description = description;
    ctx.accounts.idea.price = price;

    Ok(())
}

#[account]
pub struct Idea {
    pub owner: Pubkey,
    pub title: String,
    pub description: String,
    pub price: u128,
    pub bump: u8,
}

impl Idea {
    pub const SIZE: usize = 1 + 8 + 32 + 256 + 256 + 16;
}
