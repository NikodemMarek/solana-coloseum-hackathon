use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;

use crate::data::Idea;

#[derive(Accounts)]
pub struct TransferIdea<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub old_owner: Signer<'info>,

    /// CHECK: The new owner does not need to give permission to recieve the idea.
    #[account(mut)]
    pub new_owner: AccountInfo<'info>,

    #[account(mut)]
    pub idea: Account<'info, Idea>,

    pub system_program: Program<'info, System>,
}

pub fn transfer_idea(ctx: Context<TransferIdea>) -> Result<()> {
    let payer = &ctx.accounts.payer;
    let recipient = &ctx.accounts.old_owner;

    let cost = ctx.accounts.idea.price;

    let transfer_instruction = system_instruction::transfer(payer.key, recipient.key, cost);
    anchor_lang::solana_program::program::invoke_signed(
        &transfer_instruction,
        &[
            payer.to_account_info(),
            recipient.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[],
    )?;

    ctx.accounts.idea.owner = ctx.accounts.new_owner.key();

    Ok(())
}
