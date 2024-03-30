use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;

use crate::data::Idea;
use crate::errors::IdeaMarketplaceError;

#[derive(Accounts)]
pub struct BuyIdea<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: The seller already gave permission to sell the idea.
    #[account(mut)]
    pub seller: UncheckedAccount<'info>,

    /// CHECK: The buyer does not need to give permission to recieve the idea, because he does not
    /// pay for it.
    #[account(mut)]
    pub buyer: UncheckedAccount<'info>,

    #[account(mut)]
    pub idea: Account<'info, Idea>,

    pub system_program: Program<'info, System>,
}

pub fn buy_idea(ctx: Context<BuyIdea>) -> Result<()> {
    require!(ctx.accounts.idea.is_for_sale, IdeaMarketplaceError::IdeaNotForSale);
    require!(ctx.accounts.idea.owner == ctx.accounts.seller.key(), IdeaMarketplaceError::NotIdeaOwner);

    let payer = &ctx.accounts.payer;
    let recipient = &ctx.accounts.seller;

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

    ctx.accounts.idea.owner = ctx.accounts.buyer.key();
    ctx.accounts.idea.is_for_sale = false;

    Ok(())
}
