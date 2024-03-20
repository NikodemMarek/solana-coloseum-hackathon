use anchor_lang::prelude::*;

#[account]
pub struct Idea {
    pub title: String,
    pub description: String,
    bump: u8,
}

#[derive(Accounts)]
pub struct CreateIdea<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    /// CHECK: This account only recieves the idea, so it does not need to be checked.
    pub creator: UncheckedAccount<'info>,
    #[account(
        init,
        payer = creator,
        space = 8 + 4 + 200 + 4 + 200 + 1, seeds = [b"idea", creator.key().as_ref()],
        bump
    )]
    pub idea: Account<'info, Idea>,
    pub system_program: Program<'info, System>,
}

pub fn create_idea(ctx: Context<CreateIdea>, title: String, description: String) -> Result<()> {
    let idea = &mut ctx.accounts.idea;

    idea.title = title;
    idea.description = description;

    msg!("Idea created successfully!");

    Ok(())
}
