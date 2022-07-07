export const defultBoardSetup = {
    /* https://en.wikipedia.org/wiki/Shogi */
    // I love this file
    // position or in hand
    //sente
    "senteLanceOne":         ["19", "Lance"], 
    "senteKnightOne":        ["29", "Knight"], 
    "senteSilverGeneralOne": ["39", "SilverGeneral"], 
    "senteGoldGeneralOne":   ["49", "GoldGeneral"], 
    "senteKing":             ["59", "King"],
    "senteGoldGeneralTwo":   ["69", "GoldGeneral"], 
    "senteSilverGeneralTwo": ["79", "SilverGeneral"], 
    "senteKnightTwo":        ["89", "Knight"], 
    "senteLanceTwo":         ["99", "Lance"], 

    "senteRook":   ["28", "Rook"], 
    "senteBishop": ["88", "Bishop"], 

    "sentePawnOne":   ["17", "Pawn"], 
    "sentePawnTwo":   ["27", "Pawn"], 
    "sentePawnThree": ["37", "Pawn"], 
    "sentePawnFour":  ["47", "Pawn"], 
    "sentePawnFive":  ["57", "Pawn"], 
    "sentePawnSix":   ["67", "Pawn"], 
    "sentePawnSeven": ["77", "Pawn"], 
    "sentePawnEight": ["87", "Pawn"],
    "sentePawnNine":  ["97", "Pawn"],


    //gote
    "goteLanceOne":         ["91", "Lance"], 
    "goteKnightOne":        ["81", "Knight"], 
    "goteSilverGeneralOne": ["71", "SilverGeneral"], 
    "goteGoldGeneralOne":   ["61", "GoldGeneral"], 
    "goteKing":             ["51", "ChallengingKing"],
    "goteGoldGeneralTwo":   ["41", "GoldGeneral"], 
    "goteSilverGeneralTwo": ["31", "SilverGeneral"], 
    "goteKnightTwo":        ["21", "Knight"], 
    "goteLanceTwo":         ["11", "Lance"], 
    
    "goteRook":   ["82", "Rook"], 
    "goteBishop": ["22", "Bishop"], 
    
    "gotePawnOne":   ["93", "Pawn"], 
    "gotePawnTwo":   ["83", "Pawn"], 
    "gotePawnThree": ["73", "Pawn"], 
    "gotePawnFour":  ["63", "Pawn"], 
    "gotePawnFive":  ["53", "Pawn"], 
    "gotePawnSix":   ["43", "Pawn"], 
    "gotePawnSeven": ["33", "Pawn"], 
    "gotePawnEight": ["23", "Pawn"],
    "gotePawnNine":  ["13", "Pawn"]
};

export const defultStandSetups = {
    "sentePawnStand": ["s0", "Pawn"],
    "senteLanceStand": ["s1", "Lance"],
    "senteKnightStand": ["s2", "Knight"],
    "senteSilverGeneralStand": ["s3", "SilverGeneral"],
    "senteGoldenGeneral": ["s4", "GoldGeneral"],
    "senteRookStand": ["s5", "Rook"],
    "senteBishopStand": ["s6", "Bishop"],


    "gotePawnStand": ["s7", "Pawn"],
    "goteLanceStand": ["s8", "Lance"],
    "goteKnightStand": ["s9", "Knight"],
    "goteSilverGeneralStand": ["s10", "SilverGeneral"],
    "goteGoldenGeneral": ["s11", "GoldGeneral"],
    "goteRookStand": ["s12", "Rook"],
    "goteBishopStand": ["s13", "Bishop"]
};

export const picesImages = { 
    "King": "/pieces/syougi01_ousyou.png", 
    "ChallengingKing": "/pieces/syougi02_gyokusyou.png", 
    "GoldGeneral": "/pieces/syougi07_kinsyou.png", 
    "SilverGeneral": "/pieces/syougi08_ginsyou.png", 
    "Knight": "/pieces/syougi10_keima.png", 
    "Lance": "/pieces/syougi12_kyousya.png", 
    "Rook": "/pieces/syougi03_hisya.png", 
    "Bishop": "/pieces/syougi05_gakugyou.png", 
    "Pawn": "/pieces/syougi14_fuhyou.png", 

    // promotions
    "": ""
};