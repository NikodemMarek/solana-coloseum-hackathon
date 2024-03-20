use anchor_lang::prelude::*;

mod instructions;
use instructions::*;

declare_id!("2dbLm1MoHidv2qSNAJRgyeC9jggBPvAX7GiwDNvqGsaR");

#[program]
pub mod ideas_marketplace {
    use super::*;

    pub fn create_idea(ctx: Context<CreateIdea>, title: String, description: String) -> Result<()> {
        create::create_idea(ctx, title, description)
    }
}
