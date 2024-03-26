use anchor_lang::prelude::*;

mod instructions;
use instructions::*;

declare_id!("HD1naAHaRnZhhomAS5uSaV2xT4mrAwoV4dXP4UrXziaN");

#[program]
pub mod ideas_marketplace {
    use super::*;

    pub fn create_idea(ctx: Context<CreateIdea>) -> Result<()> {
        create_idea::create_idea(ctx)
    }

    pub fn create(ctx: Context<CreateI>) -> Result<()> {
        create::create_idea(ctx)
    }
}
