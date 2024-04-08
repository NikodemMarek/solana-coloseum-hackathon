use anchor_lang::prelude::*;

mod instructions;
mod data;
mod errors;

use instructions::*;

declare_id!("5qeG7otiV6fA7QTe3ezdaUCZRKNTehJ7zHWFxTCwNX8y");

#[program]
pub mod ideas_marketplace {
    use super::*;

    pub fn create_idea(ctx: Context<CreateIdea>, title: String, uri: String, price: u64, is_for_sale: bool) -> Result<()> {
        create_idea::create_idea(ctx, title, uri, price, is_for_sale)
    }

    pub fn buy_idea(ctx: Context<BuyIdea>) -> Result<()> {
        buy_idea::buy_idea(ctx)
    }

    pub fn set_idea_is_for_sale(ctx: Context<SetIdeaIsForSale>, is_for_sale: bool) -> Result<()> {
        set_idea_is_for_sale::set_idea_is_for_sale(ctx, is_for_sale)
    }
}
