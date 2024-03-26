use anchor_lang::prelude::*;
use anchor_spl::{associated_token::{self, AssociatedToken}, token::{mint_to, Mint, MintTo, Token}};

#[derive(Accounts)]
pub struct CreateIdea<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = payer,
        seeds = [b"mint", owner.key().as_ref()],
        bump,
        mint::authority = owner.key(),
        mint::freeze_authority = owner.key(),
        mint::decimals = 0,
    )]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    /// CHECK: He does not need to give consent
    pub idea: UncheckedAccount<'info>,
    // pub idea: Account<'info, Idea>,

    pub token_program: Program<'info, Token>,
    pub associate_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn create_idea(ctx: Context<CreateIdea>) -> Result<()> {
    // ctx.accounts.idea.title = "My Idea".to_string();
    // ctx.accounts.idea.description = "My Idea".to_string();
    
    associated_token::create(
        CpiContext::new(
            ctx.accounts.associate_token_program.to_account_info(), 
            associated_token::Create {
                payer: ctx.accounts.payer.to_account_info(), 
                associated_token: ctx.accounts.idea.to_account_info(), 
                authority: ctx.accounts.owner.to_account_info(), 
                mint: ctx.accounts.mint.to_account_info(), 
                system_program: ctx.accounts.system_program.to_account_info(), 
                token_program: ctx.accounts.token_program.to_account_info(),
            }
        )
    )?;

    let mint_to_accounts = MintTo {
        mint: ctx.accounts.mint.to_account_info().clone(),
        to: ctx.accounts.idea.to_account_info().clone(),
        authority: ctx.accounts.owner.to_account_info().clone(),
    };

    mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            mint_to_accounts,
        ),
        1,
    )?;

    Ok(())
}


#[account]
pub struct Idea {
    pub title: String,
    pub description: String,
    bump: u8,
}
