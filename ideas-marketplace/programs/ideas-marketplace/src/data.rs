use anchor_lang::prelude::*;

#[account]
pub struct Idea {
    bump: u8,

    pub owner: Pubkey,

    pub title: String,
    pub description: String,

    pub price: u64,

    pub is_for_sale: bool,
}

impl Idea {
    pub const SIZE: usize = 1 + 32 + 256 + 256 + 8 + 1;
}
