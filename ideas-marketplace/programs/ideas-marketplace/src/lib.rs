use anchor_lang::prelude::*;

mod instructions;
mod data;
mod errors;

use instructions::*;

declare_id!("JwpxVwXNbSpdn1hxbnpRnNTsnXPbV5zWVXHDKtQnTGm");

#[program]
pub mod ideas_marketplace {
    use super::*;

    pub fn create_idea(ctx: Context<CreateIdea>, title: String, description: String, price: u64, is_for_sale: bool) -> Result<()> {
        create_idea::create_idea(ctx, title, description, price, is_for_sale)
    }

    pub fn transfer_idea(ctx: Context<TransferIdea>) -> Result<()> {
        transfer_idea::transfer_idea(ctx)
    }

    pub fn set_idea_is_for_sale(ctx: Context<SetIdeaIsForSale>, is_for_sale: bool) -> Result<()> {
        set_idea_is_for_sale::set_idea_is_for_sale(ctx, is_for_sale)
    }
}
