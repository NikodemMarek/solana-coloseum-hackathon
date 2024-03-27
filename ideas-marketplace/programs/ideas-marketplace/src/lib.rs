use anchor_lang::prelude::*;

mod instructions;
use instructions::*;

declare_id!("7oj17RE89fr5rWfHFAmBtQ3p5u874Y7Mgt212Hbp3a5s");

#[program]
pub mod ideas_marketplace {
    use super::*;

    pub fn create_idea(ctx: Context<CreateIdea>, title: String, description: String, price: u128) -> Result<()> {
        create_idea::create_idea(ctx, title, description, price)
    }
}
