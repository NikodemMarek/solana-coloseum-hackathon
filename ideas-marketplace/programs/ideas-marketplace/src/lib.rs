use anchor_lang::prelude::*;

mod instructions;
use instructions::*;

declare_id!("4H4kDTf3ZhURHeXrXCvZj4GNo6aXMxb9XNa3Reoab6Gp");

#[program]
pub mod ideas_marketplace {
    use super::*;

    pub fn create_idea(ctx: Context<CreateIdea>) -> Result<()> {
        create_idea::create_idea(ctx)
    }
}
