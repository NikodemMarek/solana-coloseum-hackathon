use anchor_lang::prelude::*;

#[error_code]
pub enum IdeaMarketplaceError {
    #[msg("idea is not for sale")]
    IdeaNotForSale,

    #[msg("seller is not the current owner of the idea")]
    NotIdeaOwner,

    #[msg("idea title is too long")]
    TitleTooLong,

    #[msg("idea uri is too long")]
    UriTooLong,

    #[msg("idea price must be greater than zero")]
    InvalidPrice,
}
