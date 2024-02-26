use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::{token, associated_token};
use mpl_token_metadata::instructions;
use mpl_token_metadata::instructions::CreateMetadataAccountV3CpiAccounts;
use mpl_token_metadata::types::CollectionDetails;
use mpl_token_metadata::types::DataV2;

#[derive(Accounts)]
pub struct CreateIdea<'info> {
    #[account(mut)]
    pub mint_token: Signer<'info>,

    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    /// CHECK: I dont know why but they told me to
    pub token_account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associate_token_program: Program<'info, associated_token::AssociatedToken>,
    // pub rent: Sysvar<'info, Rent>,

    #[account(mut)]
    pub metadata_account: UncheckedAccount<'info>,
}

pub fn create_idea(ctx: Context<CreateIdea>, price: u64) -> Result<()> {
    instructions::CreateMetadataAccountV3Cpi::new(
        &ctx.accounts.system_program.to_account_info(),
        CreateMetadataAccountV3CpiAccounts {
            metadata: &ctx.accounts.metadata_account.to_account_info(),
            mint: &ctx.accounts.mint_token.to_account_info(),
            mint_authority: &ctx.accounts.signer.to_account_info(),
            payer: &ctx.accounts.signer.to_account_info(),
            update_authority: (&ctx.accounts.signer.to_account_info(), true),
            system_program: &ctx.accounts.system_program.to_account_info(),
            rent: None,
        },
        instructions::CreateMetadataAccountV3InstructionArgs {
            data: DataV2 {
                name: String::from("TEST"),
                symbol: String::from("TEST"),
                uri: String::from("none"),
                seller_fee_basis_points: 250,
                creators: Some(Vec::new()),
                collection: None,
                uses: None
            },
            is_mutable: true,
            collection_details: None,
        }
    ).invoke_signed(&[&[b"seed", &ctx.accounts.token_program.key().to_bytes()[..] ]]);

    system_program::create_account(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::CreateAccount {
                from: ctx.accounts.signer.to_account_info(),
                to: ctx.accounts.mint_token.to_account_info(),
            },
        ),
        price,
        82,
        ctx.accounts.token_program.key,
    )?;

    token::initialize_mint2(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::InitializeMint2 {
                mint: ctx.accounts.mint_token.to_account_info(),
            },
        ),
        0,
        ctx.accounts.signer.key,
        Some(ctx.accounts.signer.key),
    )?;

    associated_token::create(
        CpiContext::new(
            ctx.accounts.associate_token_program.to_account_info(),
            associated_token::Create {
                payer: ctx.accounts.signer.to_account_info(),
                associated_token: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.signer.to_account_info(),
                mint: ctx.accounts.mint_token.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
            },
        ),
    )?;

    token::mint_to(
        CpiContext::new(
            ctx.accounts.token_account.to_account_info(),
            token::MintTo {
                authority: ctx.accounts.signer.to_account_info(),
                mint: ctx.accounts.mint_token.to_account_info(),
                to: ctx.accounts.token_account.to_account_info()
            }
        ),
        1,
    )?;

    Ok(())
}
