use anchor_lang::Bump;
use anchor_lang::Bumps;
use anchor_lang::InstructionData;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::system_program;
use anchor_spl::{token, associated_token};
use mpl_candy_machine_core::candy_machine_core;

#[derive(Accounts)]
pub struct CreateCandyMachine<'info> {
    /// CHECK: I dont know why but they told me to
    pub candy_machine_program: AccountInfo<'info>, // CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR

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
    pub rent: Sysvar<'info,Rent>
}

pub fn create_candy_machine(ctx: Context<CreateCandyMachine>) -> Result<()> {
    invoke_signed(
        Instructions {},
        account_infos,
        signers_seeds
    );
    //     mpl_candy_machine_core::CandyMachineData {
    //         items_available: 1,
    //         symbol: String::from("WORKS"),
    //         seller_fee_basis_points: 250,
    //         max_supply: 1,
    //         is_mutable: true,
    //         creators: Vec::new(),
    //         config_line_settings: None,
    //         hidden_settings: None
    //     },
    //     0
    // );

    Ok(())
}
