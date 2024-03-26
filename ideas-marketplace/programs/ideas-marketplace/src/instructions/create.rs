use anchor_lang::prelude::*;
use anchor_spl::{metadata, associated_token::{self, AssociatedToken}, token::{mint_to, Mint, MintTo, Token}};
use mpl_token_metadata::{
    accounts::Metadata,
    instructions::{ MintV1CpiBuilder},
    types::{PrintSupply, TokenStandard},
};

#[derive(Accounts)]
pub struct CreateI<'info> {
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

    pub sysvar_instructions: Sysvar<'info, Rent>,

    pub token_program: Program<'info, Token>,
    pub associate_token_program: Program<'info, AssociatedToken>,
    pub token_metadata_program: Program<'info, metadata::Metadata>,
    pub system_program: Program<'info, System>,
}

pub fn create_idea(ctx: Context<CreateI>) -> Result<()> {
    let payer = ctx.accounts.payer.to_account_info();
    let owner = ctx.accounts.owner.to_account_info();

    let mint = ctx.accounts.mint.to_account_info();

    let idea = ctx.accounts.idea.to_account_info();

    let rent = ctx.accounts.sysvar_instructions.to_account_info();

    let token_program = ctx.accounts.token_program.to_account_info();
    let token_metadata_program = ctx.accounts.token_metadata_program.to_account_info();
    let system_program = ctx.accounts.system_program.to_account_info();

    msg!("tmp: {:?}", token_metadata_program.key());

    // CreateV1CpiBuilder::new(&token_metadata_program)
    //     .metadata(&idea)
    //     .mint(&mint, true)
    //     .authority(&owner)
    //     .payer(&payer)
    //     .update_authority(&owner, false)
    //     .master_edition(Some(&owner))
    //     .system_program(&system_program)
    //     .sysvar_instructions(&sysvar_instructions)
    //     .spl_token_program(&token_program)
    //     .token_standard(TokenStandard::NonFungible)
    //     .name(String::from("My NFT"))
    //     .uri(String::from("test"))
    //     .seller_fee_basis_points(550)
    //     .token_standard(TokenStandard::NonFungible)
    //     .print_supply(PrintSupply::Zero)
    //     .invoke();
    MintV1CpiBuilder::new(&token_metadata_program)
        .token(&idea)
        .token_owner(None)
        .metadata(&idea)
        .master_edition(None)
        .mint(&mint)
        .payer(&payer)
        .authority(&owner)
        .system_program(&system_program)
        .sysvar_instructions(&rent)
        .spl_token_program(&token_program)
        .spl_ata_program(&ctx.accounts.associate_token_program.to_account_info())
        .amount(1)
        .invoke()?;

    Ok(())
}
