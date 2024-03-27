use anchor_lang::prelude::*;

#[account]
pub struct Idea {
    bump: u8,

    pub owner: Pubkey,

    pub title: String,
    pub description: String,

    pub price: u64,
}

impl Idea {
    pub const SIZE: usize = 1 + 8 + 32 + 256 + 256 + 8;
}
