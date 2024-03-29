use anchor_lang::prelude::*;

#[error_code]
pub enum IdeaMarketplaceError {
    #[msg("idea is not for sale")]
    IdeaNotForSale,
}
